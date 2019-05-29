import lazyload from './LazyloadManager'

export default {
  inserted(el) {
    lazyload.add(el)
  },

  unbind(el) {
    lazyload.remove(el)
  }
}
