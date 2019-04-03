'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
  var maskWinResize = function () {
    function maskWinResize(options) {
      _classCallCheck(this, maskWinResize);

      this.hasFixedHead = options.hasFixedHead ? options.hasFixedHead : false;
      this.headId = options.headId ? options.headId : '';
      this.parentId = options.parentId;
      this.scrollTop = options.scrollTop;
      this.initCallback = $.isFunction(options.initCallback) ? options.initCallback : null;
      this.backCallback = $.isFunction(options.backCallback) ? options.backCallback : null;
    }

    _createClass(maskWinResize, [{
      key: 'init',
      value: function init() {
        var that = this;
        var oTop = '-' + Number($(window).scrollTop());

        if (this.scrollTop) {
          oTop = this.scrollTop;
        }
        $('body').css({
          top: oTop + 'px'
        }).addClass('bodyFixed');

        $('#' + that.parentId).attr('top', oTop);

        this.bindEvent();

        if (this.initCallback) {
          this.initCallback();
        }
        return this;
      }
    }, {
      key: 'bindEvent',
      value: function bindEvent() {
        var that = this;

        $(window).on('resize.' + that.parentId, function () {
          that.resize();
        });
      }
    }, {
      key: 'resize',
      value: function resize() {
        var that = this;
        var oTop = null;
        var maxBodyScrollTop = null;

        $('body').removeClass('bodyFixed');

        if (that.hasFixedHead || that.headId) {
          oTop = -($('#' + that.parentId).offset().top - $('#' + that.headId).height());
        } else {
          oTop = -$('#' + that.parentId).offset().top;
        }

        maxBodyScrollTop = -($('body').height() - $(window).height());

        if (oTop < maxBodyScrollTop) {
          oTop = maxBodyScrollTop;
        }

        if (this.scrollTop) {
          oTop = this.scrollTop;
        }

        $('#' + that.parentId).attr('top', oTop);

        $('body').css({
          top: oTop + 'px'
        }).addClass('bodyFixed');
      }
    }, {
      key: 'back',
      value: function back() {
        var that = this;
        var oTop = parseInt(-$('#' + that.parentId).attr('top'));

        $(window).unbind('resize.' + that.parentId);

        $('body').removeClass('bodyFixed').scrollTop(oTop);

        $('html').scrollTop(oTop);

        that = null;
      }
    }]);

    return maskWinResize;
  }();

  $.fn.maskWinResize = function (options) {
    if (options && options.parentId) {
      if (options.hasFixedHead || options.headId) {
        return new maskWinResize(options).init();
      } else {
        throw new Error('请传入定位头部元素ID名，谢谢————window旋转插件');
      }
    } else {
      throw new Error('请传入弹出弹窗元素ID名，谢谢————window旋转插件');
    }
  };
})(jQuery);