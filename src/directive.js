import lazyload from './LazyloadManager'

export default {
  inserted(el) {
    if (el.dataset.src) {
      lazyload.add(el)
    }
  },

  unbind(el) {
    lazyload.remove(el)
  },

  update(el, binding, vnode, oldVnode) {
    if (vnode.data.attrs['data-src'] && (vnode.data.attrs['data-src'] !== oldVnode.data.attrs['data-src'])) {
      lazyload.remove(el)
      lazyload.add(el)
    }
  }
}
