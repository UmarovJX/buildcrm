function isNotFnc(binding) {
  return typeof binding.value !== 'function'
}

const eventName = 'click'

export default {
  bind(el, binding) {
    function handler($event) {
      if (isNotFnc(binding)) return
      if (el.contains($event.target)) return
      el._clickOutside.callback($event)
    }

    el._clickOutside = { handler, callback: binding.value }
    document.addEventListener(eventName, handler)
  },

  update(el, binding) {
    if (isNotFnc(binding)) return
    el._clickOutside.callback = binding.value
  },

  unbind(el) {
    if (el._clickOutside) {
      document.removeEventListener(eventName, el._clickOutside.handler)
      delete el._clickOutside
    }
  },
}
