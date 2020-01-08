class Compile {
  constructor(vm, el) {
    this.$vm = vm
    this.$el = el // app node
  }

  compile(el = this.$el) {
    const childNodes = el.childNodes
    childNodes.forEach(node => {
      if (node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.nodeValue)) {
        console.log('compile text')
        this.compileText(node)
      } else if (node.nodeType === 1) {
        this.compileElement(node)
      }

      // 还需要遍历子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    this.update(node, RegExp.$1, 'text')
  }

  update(node, exp, dir) {
    this[dir + 'Updater'](node, this.$vm[exp])
    new Watcher(this.$vm, exp, () => {
      this[dir + 'Updater'](node, this.$vm[exp])
    })
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  compileElement(node) {
    /* 
      <p g-text="counter"></p>
    */
    const attributes = node.attributes
    const props = Array.prototype.slice.call(attributes)
    console.log('props', props)
    props.forEach(prop => {
      const { nodeName, nodeValue } = prop
      if (nodeName.includes('g-')) {
        // 说明是指令
        const dir = nodeName.slice(2)
        // console.log('dir', dir)
        this.update(node, nodeValue, dir)
      }
    })
  }
}
