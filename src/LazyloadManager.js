const CLASS_PREFIX = 'lazyload'

const STATE_CLASS = {
  VIEW: {
    IN_VIEW: `${CLASS_PREFIX}-in-view`,
    OUT_VIEW: `${CLASS_PREFIX}-out-view`,
    IN_PREV_VIEW: `${CLASS_PREFIX}-in-prev-view`,
    IN_NEXT_VIEW: `${CLASS_PREFIX}-in-next-view`,
    IN_SIBLING_VIEW: `${CLASS_PREFIX}-in-sibling-view`
  },
  LOAD: {
    LOADING: `${CLASS_PREFIX}-loading`,
    LOADED: `${CLASS_PREFIX}-loaded`,
    ERROR: `${CLASS_PREFIX}-error`
  }
}

const STATE_CLASS_LIST = {
  VIEW: Object.values(STATE_CLASS.VIEW),
  LOAD: Object.values(STATE_CLASS.LOAD)
}

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

    const changeViewClass = this.changeClass.bind(this, STATE_CLASS_LIST.VIEW, el)
    const changeLoadClass = this.changeClass.bind(this, STATE_CLASS_LIST.LOAD, el)
    const winHeight = window.screen.height
    const viewHeight = window.innerHeight
    const { top, bottom } = el.getBoundingClientRect()
    const inView = top > 0 && top < viewHeight || bottom > 0 && bottom < viewHeight
    const inPrevView = bottom > -winHeight && bottom < 0
    const inNextView = top > viewHeight && top < viewHeight + winHeight
    const inSiblingView = inPrevView || inNextView

    if (inSiblingView) {
      if (loadingSrc) {
        el.src = loadingSrc
      }

      changeViewClass([
        STATE_CLASS.VIEW.IN_SIBLING_VIEW,
        inPrevView ? STATE_CLASS.VIEW.IN_PREV_VIEW : STATE_CLASS.VIEW.IN_NEXT_VIEW
      ])
    } else if (inView) {
      changeViewClass(STATE_CLASS.VIEW.IN_VIEW)
      changeLoadClass(STATE_CLASS.LOAD.LOADING)
      el.addEventListener('load', () => {
        changeViewClass()
        changeLoadClass(STATE_CLASS.LOAD.LOADED)
      }, { once: true })
      el.addEventListener('error', () => {
        changeViewClass()
        changeLoadClass(STATE_CLASS.LOAD.ERROR)
      }, { once: true })

      if (el.src) {
        const img = new Image()

        img.onload = img.onerror = () => el.src = src
        img.src = src
      } else {
        el.src = src
      }

      this.remove(el)
    } else {
      changeViewClass(STATE_CLASS.VIEW.OUT_VIEW)
    }
  }

  handleViewportChange() {
    if (this.rafId) return

    this.rafId = requestAnimationFrame(() => {
      this.els.forEach(el => this.checkEl(el))
      this.rafId = null
    })
  }

  changeClass(list, el, items = []) {
    const adds = [CLASS_PREFIX, ...Array.isArray(items) ? items : [items]].filter(item => !!item)
    const removes = Array.from(el.classList).filter(item => list.includes(item))

    el.classList.remove(...removes.filter(item => !adds.includes(item)))

    if (items) {
      el.classList.add(...adds.filter(item => !removes.includes(item)))
    }
  }
}

export default new LazyloadManager()
