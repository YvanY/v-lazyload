var PLACEHOLDER_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
var CLASS_PREFIX = 'lazyload';
var STATE_CLASS = {
  LOADING: CLASS_PREFIX + "-loading",
  BEFORE_LOADED: CLASS_PREFIX + "-before-loaded",
  LOADED: CLASS_PREFIX + "-loaded",
  ERROR: CLASS_PREFIX + "-error"
};
var STATE_CLASS_LIST = Object.values(STATE_CLASS);
var LazyloadManager =
/*#__PURE__*/
function () {
  function LazyloadManager() {
    this.rafId = null;
    this.els = new Set();
    this.handleIntersectionChangeLegacy = this.handleIntersectionChangeLegacy.bind(this);
    this.handleIntersectionChange = this.handleIntersectionChange.bind(this);
    this.intersectionObserver = new IntersectionObserver(this.handleIntersectionChange);
  }

  var _proto = LazyloadManager.prototype;

  _proto.add = function add(el) {
    this.els.add(el);
    this.loadPlaceholderImg(el);
    this.intersectionObserver.observe(el);
    this.checkIntersectionLegacy(el);

    if (this.els.size === 1) {
      window.addEventListener('scroll', this.handleIntersectionChangeLegacy);
      window.addEventListener('resize', this.handleIntersectionChangeLegacy);
    }
  };

  _proto.remove = function remove(el) {
    this.els["delete"](el);
    this.intersectionObserver.unobserve(el);

    if (this.els.size === 0) {
      window.removeEventListener('scroll', this.handleIntersectionChangeLegacy);
      window.removeEventListener('resize', this.handleIntersectionChangeLegacy);
    }
  };

  _proto.checkIntersectionLegacy = function checkIntersectionLegacy(el) {
    var winHeight = window.screen.height;
    var viewHeight = window.innerHeight;

    var _el$getBoundingClient = el.getBoundingClientRect(),
        top = _el$getBoundingClient.top,
        bottom = _el$getBoundingClient.bottom;

    var inPrevView = bottom > -winHeight && bottom < 0;
    var inNextView = top > viewHeight && top < viewHeight + winHeight;
    var inSiblingView = inPrevView || inNextView;

    if (inSiblingView) {
      this.loadLoadingImg(el);
    }
  };

  _proto.checkIntersection = function checkIntersection(intEntry) {
    var el = intEntry.target;

    if (intEntry.intersectionRatio) {
      this.loadOriginImg(el);
      this.remove(el);
    }
  };

  _proto.loadPlaceholderImg = function loadPlaceholderImg(el) {
    this.changeClass(el);
    el.src = PLACEHOLDER_IMG;
  };

  _proto.loadLoadingImg = function loadLoadingImg(el) {
    var loading = el.dataset.loading;

    if (loading) {
      el.src = loading;
    }
  };

  _proto.loadOriginImg = function loadOriginImg(el) {
    var _this = this;

    var src = el.dataset.src;

    if (!src) {
      return;
    }

    var img = new Image();
    img.addEventListener('load', function () {
      _this.changeClass(el, STATE_CLASS.BEFORE_LOADED);

      requestAnimationFrame(function () {
        _this.changeClass(el, STATE_CLASS.LOADED);

        el.src = src;
      });
    }, {
      once: true
    });
    img.addEventListener('error', function () {
      _this.changeClass(el, STATE_CLASS.ERROR);

      el.src = src;
    }, {
      once: true
    });
    this.changeClass(el, STATE_CLASS.LOADING);
    img.src = src;
  };

  _proto.handleIntersectionChangeLegacy = function handleIntersectionChangeLegacy() {
    var _this2 = this;

    if (this.rafId) return;
    this.rafId = requestAnimationFrame(function () {
      _this2.els.forEach(function (el) {
        return _this2.checkIntersectionLegacy(el);
      });

      _this2.rafId = null;
    });
  };

  _proto.handleIntersectionChange = function handleIntersectionChange(intEntries) {
    var _this3 = this;

    intEntries.forEach(function (intEntry) {
      return _this3.checkIntersection(intEntry);
    });
  };

  _proto.changeClass = function changeClass(el, items) {
    var _el$classList;

    if (items === void 0) {
      items = [];
    }

    var adds = [CLASS_PREFIX].concat(Array.isArray(items) ? items : [items]).filter(function (item) {
      return !!item;
    });
    var removes = Array.from(el.classList).filter(function (item) {
      return STATE_CLASS_LIST.includes(item);
    });

    (_el$classList = el.classList).remove.apply(_el$classList, removes.filter(function (item) {
      return !adds.includes(item);
    }));

    if (items) {
      var _el$classList2;

      (_el$classList2 = el.classList).add.apply(_el$classList2, adds.filter(function (item) {
        return !removes.includes(item);
      }));
    }
  };

  return LazyloadManager;
}();
var lazyload = new LazyloadManager();

var lazyload$1 = {
  inserted: function inserted(el) {
    lazyload.add(el);
  },
  unbind: function unbind(el) {
    lazyload.remove(el);
  },
  update: function update(el, binding, vnode, oldVnode) {
    if (vnode.data.attrs['data-src'] !== oldVnode.data.attrs['data-src']) {
      lazyload.remove(el);
      lazyload.add(el);
    }
  }
};

var install = function install(Vue) {
  Vue.directive('lazyload', lazyload$1);
};

if (window.Vue) {
  window.lazyload = lazyload$1;
  Vue.use(install); // eslint-disable-line
}

lazyload$1.install = install;

export default lazyload$1;
export { lazyload as LazyloadManager };
