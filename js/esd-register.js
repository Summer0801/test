'use strict';

$(function () {
  'use strict';

  // 手机号码处理

  $(document).on('blur', '#tel', function () {
    getVerifyInfo('#tel', '请输入正确的手机号码', 'item-input');
  }).on('blur', '#password', function () {
    // 密码
    getVerifyInfo('#password', '请设置正确的密码', 'item-input');
  }).on('blur', '#yzm-code', function () {
    // 验证码
    getVerifyInfo('#yzm-code', '请输入正确的验证码', 'item-input');
  });
});