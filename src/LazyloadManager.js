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
    this.handleIntersectionChangeLegacy = this.handleIntersectionChangeLegacy.bind(this)
    this.handleIntersectionChange = this.handleIntersectionChange.bind(this)
    this.intersectionObserver = new IntersectionObserver(this.handleIntersectionChange)
  }

  add(el) {
    this.els.add(el)
    this.changeClass(el)
    this.intersectionObserver.observe(el)
    this.checkIntersectionLegacy(el)

    if (this.els.size === 1) {
      window.addEventListener('scroll', this.handleIntersectionChangeLegacy)
      window.addEventListener('resize', this.handleIntersectionChangeLegacy)
    }
  }

  remove(el) {
    this.els.delete(el)
    this.intersectionObserver.unobserve(el)

    if (this.els.size === 0) {
      window.removeEventListener('scroll', this.handleIntersectionChangeLegacy)
      window.removeEventListener('resize', this.handleIntersectionChangeLegacy)
    }
  }

  checkIntersectionLegacy(el) {
    if (!el.dataset.src) {
      return
    }

    const winHeight = window.screen.height
    const viewHeight = window.innerHeight
    const { top, bottom } = el.getBoundingClientRect()
    const inPrevView = bottom > -winHeight && bottom < 0
    const inNextView = top > viewHeight && top < viewHeight + winHeight
    const inSiblingView = inPrevView || inNextView

    if (inSiblingView) {
      this.loadLoadingImg(el)
    }
  }

  checkIntersection(intEntry) {
    if (intEntry.intersectionRatio) {
      this.loadOriginImg(intEntry.target)
      this.remove(intEntry.target)
    }
  }

  loadLoadingImg(el) {
    const { loading } = el.dataset

    if (loading) {
      el.src = loading
    }
  }

  loadOriginImg(el) {
    const src = el.dataset.src
    const img = new Image()

    img.addEventListener('load', () => {
      this.changeClass(el, STATE_CLASS.LOADED)
      el.src = src
    }, { once: true })
    img.addEventListener('error', () => {
      this.changeClass(el, STATE_CLASS.ERROR)
      el.src = src
    }, { once: true })

    this.changeClass(el, STATE_CLASS.LOADING)
    img.src = src
  }

  handleIntersectionChangeLegacy() {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.els.forEach(el => this.checkIntersectionLegacy(el))
      this.rafId = null
    })
  }

  handleIntersectionChange(intEntries) {
    intEntries.forEach(intEntry => this.checkIntersection(intEntry))
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
