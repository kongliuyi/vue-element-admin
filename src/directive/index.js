import store from '@/store'
// 全局 directive
export default {
  // 是否有按钮权限判定
  btnHas: {
    inserted(el, binding) {
      if (!store.getters.btns.has(binding.value)) {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          el.parentNode.removeChild(el)
        } else {
          el.remove()
        }
      }
      debugger
      let value = store.getters.btns.get(binding.value)
      el.textContent = value.title
    }
  }
}