'use strict';

$(function () {
  'use strict';

  /**
   * 弹窗显示隐藏
   */
  $('.close-icon,.modal-btn').click(function () {
    $('.modal-mode').hide();
  });

  $('.protocol-btn').click(function (e) {
    e.preventDefault();
    $('.code-modal').show();
  });

  /**
   * 密码眼睛控制
   */
  $('.pass-hide').click(function () {
    $(this).toggleClass('pass-show');
    if ($('#password').attr('type') === 'password') {
      $('#password').attr('type', 'text');
    } else {
      $('#password').attr('type', 'password');
    }
  });

  // 表单项输入时，清除页面中的错误提示
  $(document).on('focus', 'input', function () {
    $(this).parents('.item-input-box').removeClass('error-info');
  });
});

/**
 * 获取错误验证方法
 * @param {string} eventValue 节点
 * @param {string} errMessage 错误提示信息
 * @param {string} parentFlag 父节点标志 item-input-box/item-input
 *
 */
// eslint-disable-next-line no-unused-vars
function getVerifyInfo(eventValue, errMessage, parentFlag) {
  var thisVal = $(eventValue).val();
  var parentDom = $(eventValue).parents('.' + parentFlag);

  // 金额特殊处理
  if (eventValue === '#amount') {
    if (thisVal == '') {
      parentDom.find('.error-box').text(errMessage);
      parentDom.addClass('error-info');
      return false;
    }
    if (thisVal < 5000 || thisVal > 500000) {
      parentDom.find('.error-box').text('请输入5000~500000区间的申请金额');
      parentDom.addClass('error-info');
      return false;
    } else {
      parentDom.removeClass('error-info');
      return true;
    }
  } else {
    if (thisVal == '') {
      parentDom.find('.error-box').text(errMessage);
      parentDom.addClass('error-info');
      return false;
    } else {
      parentDom.removeClass('error-info');
      return true;
    }
  }
}

// input模拟select光标
$(document).on('focus', 'input[readonly]', function () {
  $(this).trigger('blur');
});