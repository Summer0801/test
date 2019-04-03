'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
  var qestionRegChecker = null;

  var regExpCheck = function () {
    function regExpCheck() {
      _classCallCheck(this, regExpCheck);

      this.data = {
        isRequire: false,
        value: '',
        checkRule: '',
        log: false
      };
    }

    _createClass(regExpCheck, [{
      key: 'getIsRequire',
      value: function getIsRequire() {
        var oBoolean = this.data.isRequire;

        //判断是否必填
        switch (typeof oBoolean === 'undefined' ? 'undefined' : _typeof(oBoolean)) {
          case 'boolean':
            return oBoolean;

          case 'number':
            switch (oBoolean) {
              case 0:
                return false;

              case 1:
                return true;

              default:
                throw new Error('请传入是否必填项的布尔值');
            }

          case 'string':
            switch (oBoolean.toLowerCase()) {
              case '1':
                return true;

              case '0':
                return false;

              case 'true':
                return true;

              case 'false':
                return false;

              default:
                throw new Error('请传入是否必填项的布尔值');
            }

          default:
            throw new Error('请传入是否必填项的布尔值');
        }
      }
    }, {
      key: 'getRegExp',
      value: function getRegExp() {
        switch (this.data.checkRule) {
          case null:
            return true;

          case 'null':
            return true;

          case '':
            throw new Error('请传入正确的校验正则字符串，如无校验规则传null，谢谢。');

          default:
            return new RegExp(this.data.checkRule); //eval("/" + str +"/");
        }
      }
    }, {
      key: 'isRequire',
      value: function isRequire(boolean) {
        //必填
        var oVal = this.data.value;
        var that = this;

        switch (oVal) {
          case '':
            return !boolean;

          default:
            return that.checkValue();
        }
      }
    }, {
      key: 'checkValue',
      value: function checkValue() {
        var reg = this.getRegExp();

        switch (reg) {
          case true:
            return true;

          default:
            return reg.test(this.data.value);
        }
      }
    }, {
      key: 'init',
      value: function init(data) {
        var oData = this.data;

        Object.assign(oData, data);

        switch (this.getIsRequire()) {
          case true:
            return this.isRequire(true);

          case false:
            return this.isRequire(false);
        }
      }
    }]);

    return regExpCheck;
  }();

  $.fn.regExpCheck = function (data) {
    switch (qestionRegChecker) {
      case null:
        qestionRegChecker = new regExpCheck();
        return qestionRegChecker.init(data);

      default:
        return qestionRegChecker.init(data);
    }
  };
})(jQuery);