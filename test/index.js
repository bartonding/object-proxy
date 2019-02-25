const ObjectProxy = require('../src/ObjectProxy')

let obj0 = {a:1,b:2}
let obj1 = new Proxy(obj0, {
  get(o, k) { return o[k] },
  // set(o, k, v) { o[k] = v; return true; }
})
let obj2 = window.obj2 = ObjectProxy(obj0)
let obj21 = window.obj21 = ObjectProxy(obj0, {
  getAB() {
    console.log(this)
    return this.a + this.b
  }
})
let obj3 = new Proxy(obj0, {
  get(o, k) { return o[k] },
  set(o, k, v) { o[k] = v; return true; }
})

obj2.onAsync('a', (key, newValue, oldValue, obj, proxy) => {
  console.log('obj2: ', key, newValue, oldValue, obj, proxy)
})
obj2.on('b', (key, newValue, oldValue, obj, proxy) => {
  console.log('obj2: ', key, newValue, oldValue, obj, proxy)
})
obj21.on('a', (key, newValue, oldValue, obj, proxy) => {
  console.log('obj21: ', key, newValue, oldValue, obj, proxy)
})

obj2.on({
  a (key, newValue, oldValue, obj, proxy) {
    // obj.b = newValue + oldValue
    proxy.b = newValue + oldValue
  }
})



// -----------------------------------------------------------------------------

function testGet(name, o, k, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    o[k]
  }
  console.timeEnd(name)
}

function testSet(name, o, k, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    o[k] = i
  }
  console.timeEnd(name)
}
window.testGet = () => {
  const times = 1000000
  testGet('get Native', obj0, 'a', times)
  testGet('get Proxy1' , obj1, 'a', times)
  testGet('get Proxy2' , obj3, 'a', times)
  testGet('get ObjectProxy', obj2, 'a', times)
}
window.testGetName = () => {
  const times = 10000000
  testGet('get Native', obj0, 'a', times)
  testGet('get Proxy1' , obj1, 'a', times)
  testGet('get Proxy2' , obj3, 'a', times)
  testGet('get ObjectProxy', obj2, 'getA', times)
}
window.testSet = () => {
  const times = 10000000
  testSet('set Native', obj0, 'a', times)
  testSet('set Proxy1' , obj1, 'a', times)
  testSet('set Proxy2' , obj3, 'a', times)
  testSet('set ObjectProxy', obj2, 'a', times)
  testSet('set Native', obj0, 'a', times)
  testSet('set Proxy1' , obj1, 'a', times)
  testSet('set Proxy2' , obj3, 'a', times)
  testSet('set ObjectProxy' , obj2, 'a', times)
}

// -----------------------------------------------------------------------------
function testStringFind1(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    // /^get\w/.test(str)
    /^get\w/.test(str+i)
  }
  console.timeEnd(name)
}
function testStringFind2(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    // ((str).indexOf('get') === 0)
    ((str+i).indexOf('get') === 0)
  }
  console.timeEnd(name)
}
function testStringFind3(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    // ((str).substr(0, 3) === 'get')
    ((str+i).substr(0, 3) === 'get')
  }
  console.timeEnd(name)
}
function testStringFind4(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    // ((str).substring(0, 3) === 'get')
    ((str+i).substring(0, 3) === 'get')
  }
  console.timeEnd(name)
}
window.testStringFind = (str) => {
  let times = 10000000;
  // let str = 'getName'
  testStringFind1('regx', str, times)
  testStringFind2('indexof', str, times)
  testStringFind3('substr', str, times)
  testStringFind4('substring', str, times)
}


// -----------------------------------------------------------------------------
function testStringReplace1(name, str, times) {
  console.time(name)
  let result;
  for (let i = 0; i < times; i++) {
    result = (str+i).replace(/^[gs]et(\w)(\w+)/, function (a,b1,b2) { 
    // str.replace(/^[gs]et(\w)(\w+)/, function (a,b1,b2) { 
      return b1.toLowerCase() + b2 
    });
  }
  console.timeEnd(name)
}
function testStringReplace2(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    ((str+i).substr(3 ,1).toLowerCase() + str.substr(4));
    // (str.substr(3 ,1).toLowerCase() + str.substr(4));
  }
  console.timeEnd(name)
}
function testStringReplace3(name, str, times) {
  console.time(name)
  for (let i = 0; i < times; i++) {
    ((str+i).substring(3,4).toLowerCase() + str.substring(4))
    // (str.substring(3,4).toLowerCase() + str.substring(4))
  }
  console.timeEnd(name)
}
window.testStringReplace = (str) => {
  let times = 10000000;
  // let str = 'getName'
  testStringReplace1('regx', str, times)
  testStringReplace2('substr', str, times)
  testStringReplace3('substring', str, times)
}