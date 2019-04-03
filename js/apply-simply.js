'use strict';

$(function () {
  'use strict';

  $(document).on('blur', '#amount', function () {
    // 验证金额
    getVerifyInfo('#amount', '请输入申请金额', 'item-input-box');
  }).on('blur', '#userName', function () {
    // 姓名必填
    getVerifyInfo('#userName', '请输入姓名', 'item-input-box');
  }).on('click', '#selectAddress', function () {
    // 地址选择弹框
    $(this).modalPopup({
      title: '省市区选择',
      data: provinces(3),
      columns: 3
    });
  }).on('click', '#refundVal', function () {
    // 申请期限弹框
    $(this).modalPopup({
      title: '申请期限',
      data: [{ code: 1, name: '1期' }, { code: 2, name: '2期' }, { code: 3, name: '3期' }, { code: 4, name: '4期' }, { code: 5, name: '5期' }, { code: 6, name: '6期' }, { code: 12, name: '12期' }, { code: 18, name: '18期' }, { code: 24, name: '24期' }, { code: 36, name: '36期' }],
      columns: 1
    });
  });

  // 提交申请按钮
  $('#apply').on('click', function () {
    var amountVal = $('#amount').val(); //申请金额
    var userName = $('#userName').val(); //姓名

    // const refundValue = $('#refundVal').val(); //申请期限
    // const addrVal = $('#selectAddress').val(); //城市
    // const referrer = $('#referrer').val(); //推荐人

    var agreeVal = $('#checkbox:checked').val();

    if (!amountVal || amountVal.length === 0) {
      getVerifyInfo('#amount', '请输入申请金额', 'item-input-box');
      return;
    }

    if (!userName || userName.length === 0) {
      getVerifyInfo('#userName', '请输入姓名', 'item-input-box');
      return;
    }

    var refunVerify = getVerifyInfo('#refundVal', '请选择申请期限', 'item-input-box');

    var addressVerify = getVerifyInfo('#selectAddress', '请选择所在城市', 'item-input-box');

    if (!refunVerify || !addressVerify) {
      return;
    }

    // 注册协议文案未定
    if (!agreeVal) {
      $('.registered-modal').show();
    }
  });
});