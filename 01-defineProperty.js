function defineReactive(obj, key, val) {
  observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`get ${key} value: ${val}`)
      return val
    },
    set(newVal) {
      console.log(`set ${key} value: ${newVal}`)
      if (newVal !== val) {
        val = newVal
      }
      if (newVal !== null && typeof newVal === 'object') {
        defineReactive(obj, key, newVal)
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

const obj = { name: 'zqguo', age: 11, info: { orderId: 1 } }
observe(obj)
obj.name
obj.name = 'rick'
obj.name
obj.age
console.log('-------------------')
obj.info
obj.info.orderId
obj.info.orderId = 2
// console.log(obj.info.orderId)
// obj.info.foo = 'bar'
defineReactive(obj, 'gender', 'male')
obj.gender = 'male'

console.log('-------------------')
obj.info = { pid: 123 }
obj.info.pid
obj.info.pid = 21321
obj.info.pid
