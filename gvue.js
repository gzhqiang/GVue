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
    // console.log('dep', this.__ob__.dep)
    this.__ob__.notify()
    // if (inserted) {
    //   observeArray(this, inserted)
    // }
  })
})

function defineReactive(obj, key, val) {
  observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`get ${key} value: ${val}`)
      // Dep.target && dep.addDep(Dep.target)
      if (Dep.target) {
        dep.addDep(Dep.target)
        if (Array.isArray(val)) {
          val.__ob__ = dep
          console.log(val)
        }
      }
      return val
    },
    set(newVal) {
      console.log(`set ${key} value: ${newVal}`)
      if (newVal !== val) {
        val = newVal
        dep.notify()
      }
      if (newVal !== null && typeof newVal === 'object') {
        defineReactive(obj, key, newVal)
      }
    }
  })
}

class Observer {
  constructor(data) {
    /*     if (Array.isArray(data)) {
      // this.dep = new Dep()
      // data.__proto__.dep = dep
      // def(data, '__ob__', this)
      // arrayMethods.push.call(data, 5)
      // 那么到哪里添加watcher呢
    } else {
      
    } */
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

function observe(obj) {
  if (obj === null || !isObject(obj)) {
    return
  }

  new Observer(obj)
}

function proxy(vm, data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return data[key]
      },
      set(newVal) {
        data[key] = newVal
      }
    })
  })
}

class GVue {
  constructor(options) {
    /*
    options = {
        el: '#app',
        data: {
          counter: 1,
          desc: '<span style="color:red">kvue可还行？</span>'
        }
      }
    */
    this.$options = options

    // 拿出里面的data做observe
    this.$data = options.data

    this.$el = document.querySelector(options.el)
    // 劫持数据
    observe(this.$data)

    proxy(this, this.$data)

    // compile模板
    const compile = new Compile(this, this.$el)
    compile.compile()
  }
}

class Dep {
  constructor(vm) {
    this.deps = []
    this.$vm = vm
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => {
      dep.update()
    })
  }
}

class Watcher {
  constructor(vm, exp, updateFn) {
    this.$vm = vm
    this.$exp = exp
    this.$updateFn = updateFn
    Dep.target = this
    vm[exp]
    Dep.target = null
  }

  update() {
    this.$updateFn && this.$updateFn()
  }
}
