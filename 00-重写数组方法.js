/*
 * 重写Array push方法
 * */
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// Observer.prototype.observeArray = function observeArray(items) {
//   for (var i = 0, l = items.length; i < l; i++) {
//     observe(items[i])
//   }
// }

observeArray = function observeArray(items) {
  // for (var i = 0, l = items.length; i < l; i++) {
  //   // observe(items[i])
  //   // def(items[i], '__ob__')
  //   // 通知页面
  //   console.log(items[i])
  // }
}

methodsToPatch.forEach(method => {
  const original = arrayProto[method]
  def(arrayMethods, method, function() {
    let args = [],
      len = arguments.length
    while (len--) args[len] = arguments[len]
    const result = original.apply(this, args)
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // if (inserted) {
    //   observeArray(inserted)
    // }
  })
})

const arr = [1, 2, 3, 4]
// arr.push(5)
// console.log(arr)

arrayMethods.push.call(arr, 5)
console.log(arr)
