const CLASS_PREFIX = 'lazyload'

const STATE_CLASS = {
  LOADING: `${CLASS_PREFIX}-loading`,
  LOADED: `${CLASS_PREFIX}-loaded`,
  ERROR: `${CLASS_PREFIX}-error`
}

const STATE_CLASS_LIST = Object.values(STATE_CLASS)

export class LazyloadManager {
  constructor() {
    this.rafId = null
    this.els = new Set()
    this.handleViewportChange = this.handleViewportChange.bind(this)
  }

  add(el) {
    this.els.add(el)
    this.checkEl(el)

    if (this.els.size === 1) {
      window.addEventListener('scroll', this.handleViewportChange)
      window.addEventListener('resize', this.handleViewportChange)
    }
  }

  remove(el) {
    this.els.delete(el)

    if (this.els.size === 0) {
      window.removeEventListener('scroll', this.handleViewportChange)
      window.removeEventListener('resize', this.handleViewportChange)
    }
  }

  checkEl(el) {
    const { loading: loadingSrc, src } = el.dataset

    if (!src) {
      return
    }

    const changeStateClass = this.changeClass.bind(this, el)
    const winHeight = window.screen.height
    const viewHeight = window.innerHeight
    const { top, bottom } = el.getBoundingClientRect()
    const inView = top >= 0 && top < viewHeight || bottom >= 0 && bottom < viewHeight
    const inPrevView = bottom > -winHeight && bottom < 0
    const inNextView = top > viewHeight && top < viewHeight + winHeight
    const inSiblingView = inPrevView || inNextView

    if (inSiblingView) {
      if (loadingSrc) {
        el.src = loadingSrc
      }
    } else if (inView) {
      const img = new Image()

      img.addEventListener('load', () => {
        changeStateClass(STATE_CLASS.LOADED)
        el.src = src
      }, { once: true })
      img.addEventListener('error', () => {
        changeStateClass(STATE_CLASS.ERROR)
        el.src = src
      }, { once: true })

      changeStateClass(STATE_CLASS.LOADING)
      img.src = src
      this.remove(el)
    }
  }

  handleViewportChange() {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.els.forEach(el => this.checkEl(el))
      this.rafId = null
    })
  }

  changeClass(el, items = []) {
    const adds = [CLASS_PREFIX, ...Array.isArray(items) ? items : [items]].filter(item => !!item)
    const removes = Array.from(el.classList).filter(item => STATE_CLASS_LIST.includes(item))

    el.classList.remove(...removes.filter(item => !adds.includes(item)))

    if (items) {
      el.classList.add(...adds.filter(item => !removes.includes(item)))
    }
  }
}

export default new LazyloadManager()
