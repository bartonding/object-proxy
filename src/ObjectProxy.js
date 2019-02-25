// Usage:
// 
// import ObjectProxy from 'path/to/ObjectProxy'
// 
// let op = ObjectProxy({a: 1, b: 2})

// op.on((key, newValue, oldValue, obj, proxy) => {
//   console.log('> on <*>', key, newValue, oldValue, obj, proxy)
// })

// op.onAsync('a', (key, newValue, oldValue, obj, proxy) => {
//   console.log('> on <a>', key, newValue, oldValue, obj, proxy)
// })

// op.on({
//   a (key, newValue, oldValue, obj, proxy) {
//     // obj.b = newValue + oldValue
//     proxy.b = newValue + oldValue
//   }
// })

function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

function proxyOn (handler, isAsync, keys, fn) {
  if (isObject(keys)) {
    Object.keys(keys).forEach((k) => {
      proxyOn(handler, isAsync, k, keys[k])
    })
    return handler.proxy;
  }

  if (arguments.length === 3) {
    fn = keys;
    keys = '*';
  }
  if (typeof fn !== 'function' || typeof keys !== 'string') return;

  fn._isAsync = isAsync;

  keys = keys.split(/\s*,\s*/)
  keys.forEach((key) => {
    let queue = handler.events[key] || []
    queue.push(fn)
    handler.events[key] = queue
  })
  return handler.proxy;
}

function generateProxyHandler () {
  let handler = {
    proxy: null,
    events: {'*': []},
    extras: null
  };
  let events = handler.events;

  function _valueChange(obj, key, newValue, oldValue, proxy) {
    // console.log('> _valueChange: ', obj, key, newValue, oldValue, proxy, events)
    const keyFns = events[key] || []
    const allFns = events['*']

    function runCallback(fn) {
      if (typeof fn !== 'function') return;
      // console.log(fn._isAsync, fn, fn.toString())
      if (fn._isAsync) {
        setTimeout(() => {
          fn(key, newValue, oldValue, obj, proxy)
        }, 0)
      } else {
        fn(key, newValue, oldValue, obj, proxy)
      }
    }

    keyFns.forEach(runCallback)
    allFns.forEach(runCallback)
  }

  handler.methods = {
    get (obj, key) {
      const proxy = handler.proxy;
      if ('on' === key) return proxyOn.bind(obj, handler, false);
      if ('onAsync' === key) return proxyOn.bind(obj, handler, true);
      // console.log('> ObjectProxy.get', key, obj)
      if (key in obj) return obj[key];
      if (key in handler.extras) {
        if (typeof handler.extras[key] === 'function') {
          return handler.extras[key].bind(proxy);
        }
        return handler.extras[key];
      }
      if (/^[gs]et\w/.test(key)) {
        let _GetOrSet = key.substring(0, 3);
        let _isGet = _GetOrSet.substring(0, 1) === 'g'
        key = key.substring(3, 4).toLowerCase() + key.substring(4);
        return _isGet ? () => obj[key] : (v) => proxy[key] = v;
      }
      return;
    },
    set (obj, key, val) {
      if ('on' === key) return false;
      // console.log('> ObjectProxy.set', key, val, obj)
      const oldValue = obj[key]
      obj[key] = val;
      if (oldValue !== val) {
        _valueChange(obj, key, val, oldValue, handler.proxy)
      }
      return true;
    }
  };

  return handler;
}

function ObjectProxy (obj, extras) {
  if (typeof obj === 'undefined') {
    obj = {};
  }

  if (!isObject(obj)) {
    throw new TypeError('First arg must be Object or undefined, you provided ', obj);
  }

  let handler = generateProxyHandler();
  handler.extras = extras || {};
  let proxy = new Proxy(obj, handler.methods);
  handler.proxy = proxy;

  return proxy;
}

module.exports = ObjectProxy;