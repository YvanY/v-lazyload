import lazyload from './directive'

const install = function(Vue) {
  Vue.directive('lazyload', lazyload)
}

if (window.Vue) {
  window.lazyload = lazyload
  Vue.use(install) // eslint-disable-line
}

lazyload.install = install
export default lazyload
