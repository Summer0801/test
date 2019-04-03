'use strict';

(function ($) {
  var phoneFormat = function phoneFormat(parentInputId) {
    var $el = null;
    this.winResize = null;
    this.parentInputId = parentInputId;

    $('<div class="specialphone-fixed" parent="' + this.parentInputId + '">\n        <div class="specialphone-block">\n          <div class = "specialphone-content" > \n            <div class = "specialphone-title" > \n            <div class="text">\u8BF7\u6309\u4EE5\u4E0B\u683C\u5F0F\u4F9D\u6B21\u8F93\u5165</div>\n            <div class="confirm">\u786E\u5B9A</div>\n          </div>\n          <div class="specialphone-input">\n            <input name="" class="district" type="tel" placeholder="\u533A\u53F7" maxlength="5">\n            <input name="" class="phone" type="tel" placeholder="\u7535\u8BDD\u53F7\u7801" maxlength="8">\n            <input name="" class="extension" type="tel" placeholder="\u5206\u673A\u53F7" maxlength="6">\n            <div class="extension-text">(\u53EF\u4E0D\u586B)</div>\n          </div>\n        </div>\n      </div>\n      ').appendTo('body');

    $el = $('.specialphone-fixed[parent="' + this.parentInputId + '"]');

    this.el = $el;

    if ($('#' + this.parentInputId).val().trim() != '') {
      this.showVal();
    }

    this.bindEvent();

    this.show();
  };

  phoneFormat.prototype.bindEvent = function () {
    var el = '.specialphone-fixed[parent="' + this.parentInputId + '"]';
    var $el = $(el);
    var extensionText = $el.find('.extension-text');
    var that = this;

    $(document).on('keyup.' + that.parentInputId, el + ' .extension', function () {
      if ($(this).val().trim() != '') {
        extensionText.hide();
      } else {
        extensionText.show();
      }
    }).on('blur.' + that.parentInputId, function () {
      if ($(this).val().trim() != '') {
        extensionText.hide();
      } else {
        extensionText.show();
      }
    }).on('keyup.' + that.parentInputId, el + ' .district', function () {
      if ($(this).val().length == '5') {
        $el.find('.district').blur();

        $el.find('.phone').focus();
      }
    }).on('keyup.' + that.parentInputId, el + ' .phone', function () {
      if ($(this).val().length == '8') {
        $el.find('.phone').blur();

        $el.find('.extension').focus();
      }
    }).on('click.' + that.parentInputId, el, function () {
      that.hide();
    }).on('click.' + that.parentInputId, el + ' .confirm', function () {
      $el.find('.input').blur();

      if (that.check()) {
        that.result();
      } else {
        that.showTips();
      }
    }).on('click.' + that.parentInputId, el + ' .specialphone-block', function () {
      return false;
    });
  };

  phoneFormat.prototype.show = function () {
    var that = this;

    this.winResize = $('#' + this.parentInputId).maskWinResize({
      parentId: that.parentInputId,
      headId: 'head'
    });

    this.el.fadeIn();
  };

  phoneFormat.prototype.showVal = function () {
    var oVal = $('#' + this.parentInputId).val().split('-');
    var $el = this.el;

    if (oVal.length >= 2) {
      $el.find('.district').val(oVal[0]);

      $el.find('.phone').val(oVal[1]);
    }

    if (oVal.length == 3) {
      $el.find('.extension').val(oVal[2]);

      $el.find('.extension-text').hide();
    }
  };

  phoneFormat.prototype.hide = function () {
    //隐藏
    // eslint-disable-next-line no-unused-vars
    var that = this;

    this.winResize.back();

    $('.specialphone-fixed[parent="' + this.parentInputId + '"]').fadeOut(function () {
      $(this).remove();

      // eslint-disable-next-line no-const-assign
      that = null;
    });

    $(document).unbind('click.' + this.parentInputId).unbind('keyup.' + this.parentInputId).unbind('blur' + this.parentInputId);
  };

  phoneFormat.prototype.check = function () {
    var el = '.specialphone-fixed[parent="' + this.parentInputId + '"]';
    var $el = $(el);
    var districtVal = $el.find('.district').val().trim();
    var phoneVal = $el.find('.phone').val().trim();

    if (districtVal.length >= 3 && districtVal.length <= 5) {
      if (phoneVal.length >= 7 && phoneVal.length <= 8) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  phoneFormat.prototype.showTips = function () {
    var oTips = this.el.find('.specialphone-tips');
    var that = this;

    if (oTips.length == 0) {
      $('<div class="specialphone-tips"><div class="tips-text">请输入正确的单位电话！区号为以0开头的3至5位数字，电话为非0、1开头的7至8位数字，分机号最多6位数字！</div></div>').appendTo($('.specialphone-fixed[parent="' + that.parentInputId + '"]'));

      oTips = this.el.find('.specialphone-tips');
    }

    oTips.stop().fadeIn(function () {
      var oThis = $(this);

      if (that.time) {
        window.clearTimeout(that.time);
      }

      that.time = setTimeout(function () {
        oThis.stop().fadeOut();

        window.clearTimeout(that.time);

        that.time = undefined;
      }, 1000);
    });
  };

  phoneFormat.prototype.result = function () {
    //返回结果
    var oVal = '';
    var $el = this.el;
    var $parentInput = $('#' + this.parentInputId);
    var rex = $parentInput.attr('data-regexrule');
    var isRequire = $parentInput.attr('data-isrequire');

    oVal = $el.find('.district').val().trim() + '-' + $el.find('.phone').val().trim();

    if ($el.find('.extension').val().trim().length != 0) {
      oVal += '-' + $el.find('.extension').val().trim();
    }
    if ($.fn.regExpCheck({
      isRequire: isRequire,
      checkRule: rex,
      value: oVal
    })) {
      $('#' + this.parentInputId).val(oVal);
      this.hide();
    } else {
      this.showTips();
    }
  };

  $.fn.phoneFormat = function () {
    var id = $(this).attr('id');
    if (id && $(this).is('input')) {
      return new phoneFormat(id);
    } else {
      throw new Error('请用有id名的input标签，谢谢————企业电话插件');
    }
  };
})(jQuery);