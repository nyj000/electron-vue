export default {
  // 点击绑定元素外部时出发绑定事件
  clickoutside: {
    bind (el, binding) {
      el.__documentClickHandler = (e) => {
        let target = e.target
        if (target && !el.contains(target)) {
          binding.value(e)
        }
      }
      document.addEventListener('click', el.__documentClickHandler)
    },
    unbind (el, binding) {
      document.removeEventListener('click', el.__documentClickHandler)
    }
  },
  // 点击时触发绑定元素的点击事件
  clickbind: {
    bind (el, binding) {
      el.__ClickHandler = (e) => {
        let target = document.getElementById(binding.value)
        if (target instanceof HTMLElement) {
          let event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, true, window)
          target.dispatchEvent(event)
        }
      }
      el.addEventListener('click', el.__ClickHandler)
    },
    unbind (el, binding) {
      el.removeEventListener('click', el.__ClickHandler)
    }
  }
}
