var CLASS_PREFIX = 'lazyload';
var STATE_CLASS = {
  LOADING: CLASS_PREFIX + "-loading",
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
    this.handleViewportChange = this.handleViewportChange.bind(this);
  }

  var _proto = LazyloadManager.prototype;

  _proto.add = function add(el) {
    this.els.add(el);
    this.checkEl(el);

    if (this.els.size === 1) {
      window.addEventListener('scroll', this.handleViewportChange);
      window.addEventListener('resize', this.handleViewportChange);
    }
  };

  _proto.remove = function remove(el) {
    this.els["delete"](el);

    if (this.els.size === 0) {
      window.removeEventListener('scroll', this.handleViewportChange);
      window.removeEventListener('resize', this.handleViewportChange);
    }
  };

  _proto.checkEl = function checkEl(el) {
    var _el$dataset = el.dataset,
        loadingSrc = _el$dataset.loading,
        src = _el$dataset.src;

    if (!src) {
      return;
    }

    var changeStateClass = this.changeClass.bind(this, el);
    var winHeight = window.screen.height;
    var viewHeight = window.innerHeight;

    var _el$getBoundingClient = el.getBoundingClientRect(),
        top = _el$getBoundingClient.top,
        bottom = _el$getBoundingClient.bottom;

    var inView = top >= 0 && top < viewHeight || bottom >= 0 && bottom < viewHeight;
    var inPrevView = bottom > -winHeight && bottom < 0;
    var inNextView = top > viewHeight && top < viewHeight + winHeight;
    var inSiblingView = inPrevView || inNextView;

    if (inSiblingView) {
      if (loadingSrc) {
        el.src = loadingSrc;
      }
    } else if (inView) {
      var img = new Image();
      img.addEventListener('load', function () {
        changeStateClass(STATE_CLASS.LOADED);
        el.src = src;
      }, {
        once: true
      });
      img.addEventListener('error', function () {
        changeStateClass(STATE_CLASS.ERROR);
        el.src = src;
      }, {
        once: true
      });
      changeStateClass(STATE_CLASS.LOADING);
      img.src = src;
      this.remove(el);
    }
  };

  _proto.handleViewportChange = function handleViewportChange() {
    var _this = this;

    if (this.rafId) return;
    this.rafId = requestAnimationFrame(function () {
      _this.els.forEach(function (el) {
        return _this.checkEl(el);
      });

      _this.rafId = null;
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
