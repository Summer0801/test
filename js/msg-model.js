'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ($ => {
var MessageModel = function () {
  function MessageModel(opt) {
    _classCallCheck(this, MessageModel);

    this.defaults = {
      time: true,
      content: '内容',
      callback: function callback() {}
    };
    this.options = $.extend({}, this.defaults, opt || {});
  }

  _createClass(MessageModel, [{
    key: 'createHtml',
    value: function createHtml() {
      //创建DOM
      var self = this;
      var _self$options = self.options,
          time = _self$options.time,
          content = _self$options.content;

      var html = '<div class="msg-mode">\n                    <div class="msg-bg ' + (time ? 'hide' : 'show') + '"></div>\n                    <div class="msg-con">\n                      <div class="msg-body ' + (time ? 'msg-body-bg' : '') + '">\n                        <div class="msg-close ' + (time ? 'hide' : 'show') + '"></div>\n                        <div class="msg-info ' + (time ? 'show-text' : 'hide-text') + '">' + content + '</div>\n                      </div>\n                    </div>\n                    </div>';
      $(html).appendTo('body');
      time ? self.setTimeoutFn() : '';
      $('.msg-close').click(function () {
        self.close();
      });
    }
  }, {
    key: 'close',
    value: function close() {
      //关闭弹窗
      $('.msg-mode').fadeOut(function () {
        $(this).remove();
      });
    }
  }, {
    key: 'setTimeoutFn',
    value: function setTimeoutFn() {
      var _this = this;

      setTimeout(function () {
        _this.close();
      }, 1500);
    }
  }]);

  return MessageModel;
}();
// let m = new MessageModel({
//   content: '还有待绑定的放款卡/还款卡',
// });
// m.createHtml();
// }
// )(jQuery);