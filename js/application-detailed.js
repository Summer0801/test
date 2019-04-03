'use strict';

$(function () {
  'use strict';

  // 切换工作信息和生意信息的可见性
  $(document).on('click', '.container .headline-box', function () {
    $(this).parent().siblings().removeClass('toggle');
    $('.container .toggle-space').slideUp(150);

    $(this).parent().hasClass('toggle') ? $(this).parent().removeClass('toggle').end().next().slideUp(150) : $(this).parent().addClass('toggle').end().next().slideDown(150);
  });

  // 紧急联系人交互效果
  $(document).on('keyup', '.top-row .input', function () {
    var $this = $(this);
    var label = $this.prev('.label');

    label.addClass('active');
  }).on('blur', '.top-row .input', function () {
    var $this = $(this);
    var label = $this.prev('.label');

    $this.val().trim() === '' ? label.removeClass('active') : label.addClass('active');
  }).on('focus', '.top-row .input', function () {
    var $this = $(this);
    var label = $this.prev('.label');
    var targetId = $this.attr('id');

    label.addClass('active');

    if (targetId === 'relation') {
      $this.val() === '' ? label.removeClass('active') : label.addClass('active');
    }
  });

  $(document)
  // 紧急联系人-关系选择
  .on('click', '#relationBox', function () {
    $('#relation').val() === '' ? $('#relation').prev('.label').removeClass('active') : $('#relation').prev('.label').addClass('active');

    $('.relation-container').toggleClass('toggle-relation');
    $('.arrow-down').toggleClass('arrow-top');
    return false;
  }).on('click', '.relation-wrapper .option', function () {
    $(this).siblings().removeClass('option-active').end().addClass('option-active');

    $('#relation').prev('.label').addClass('active');

    $('#relation').val($(this).text());
    $('.relation-container').addClass('toggle-relation');
    $('.arrow-down').removeClass('arrow-top');
    return false;
  }).on('click', function () {
    $('.relation-container').addClass('toggle-relation');
    $('.arrow-down').removeClass('arrow-top');
  });

  // 贷款目的
  $(document).on('click', '#loanPurpose', function () {
    $(this).modalPopup({
      title: '贷款目的',
      data: loanPurpose,
      columns: 2
    });
  });

  // 婚姻状况
  $(document).on('click', '#martalStatus', function () {
    $(this).modalPopup({
      title: '婚姻状况',
      data: martalStatus,
      columns: 1
    });
  });

  // 居住地址
  $(document).on('click', '#address', function () {
    $(this).modalPopup({
      title: '省市区选择',
      data: provinces(3),
      columns: 3
    });
  });

  // 单位名称
  $(document).on('click', '#companyName', function () {
    $(this).addressSelect();
  });

  // 单位地区
  $(document).on('click', '#companyArea', function () {
    $(this).modalPopup({
      title: '单位地区',
      data: provinces(3),
      columns: 3
    });
  });

  // 入职时间
  $(document).on('click', '#entryTime', function () {
    $(this).modalPopup({
      title: '入职时间',
      data: entryTime,
      columns: 2
    });
  });

  // 单位电话
  $(document).on('click', '#companyTel', function () {
    $(this).phoneFormat();
  });

  // 企业地区
  $(document).on('click', '#businessArea', function () {
    $(this).modalPopup({
      title: '企业地区',
      data: provinces(3),
      columns: 3
    });
  });

  // 企业名称
  $(document).on('click', '#businessName', function () {
    $(this).addressSelect();
  });

  // 企业联系方式
  $(document).on('click', '#businessTel', function () {
    $(this).phoneFormat();
  });

  // 经营时间
  $(document).on('click', '#businessTime', function () {
    $(this).modalPopup({
      title: '经营时间',
      data: entryTime,
      columns: 2
    });
  });

  // 校验工作信息
  $(document).on('click', '#companyBtn', function () {
    var companyAddressVerify = $('#companyAddress').val().trim(); // 单位详址
    var companyTelVerify = $('#companyTel').val(); // 单位电话
    var monthlySalaryVerify = $('#monthlySalary').val(); // 每月收入

    $(this).removeClass('btn-success');

    $('#companyChecked').removeClass('checked-show');

    var companyNameVerify = getVerifyInfo('#companyName', '请选择单位名称', 'item-input-box');

    if (!companyNameVerify) {
      return;
    }

    var companyAreaVerify = getVerifyInfo('#companyArea', '请选择单位地区', 'item-input-box');

    if (!companyAreaVerify) {
      return;
    }

    if (!companyAddressVerify || companyAddressVerify.length === 0) {
      getVerifyInfo('#companyAddress', '请输入单位详址', 'item-input-box');
      return;
    }

    if (!companyTelVerify) {
      getVerifyInfo('#companyTel', '请输入单位电话', 'item-input-box');
      return;
    }

    var entryTimeVerify = getVerifyInfo('#entryTime', '请选择入职时间', 'item-input-box');

    if (!entryTimeVerify) {
      return;
    }

    if (!monthlySalaryVerify || monthlySalaryVerify.length === 0) {
      getVerifyInfo('#monthlySalary', '请输入每月收入', 'item-input-box');
      return;
    }

    $(this).addClass('btn-success');

    $('#companyChecked').addClass('checked-show');
  });

  // 校验生意信息
  $(document).on('click', '#businessBtn', function () {
    var businessAddressVerify = $('#businessAddress').val().trim(); // 企业详址
    var businessTelVerify = $('#businessTel').val(); // 企业联系方式
    var businessVolumeVerify = $('#businessVolume').val(); // 年营业额

    $(this).removeClass('btn-success');

    $('#businessChecked').removeClass('checked-show');

    var businessNameVerify = getVerifyInfo('#businessName', '请选择企业名称', 'item-input-box');

    if (!businessNameVerify) {
      return;
    }

    var businessAreaVerify = getVerifyInfo('#businessName', '请选择企业地区', 'item-input-box');

    if (!businessAreaVerify) {
      return;
    }

    if (!businessAddressVerify || businessAddressVerify.length === 0) {
      getVerifyInfo('#businessAddress', '请输入企业详址', 'item-input-box');
      return;
    }

    if (!businessTelVerify) {
      getVerifyInfo('#businessTel', '请输入联系电话', 'item-input-box');
      return;
    }

    if (!businessVolumeVerify) {
      getVerifyInfo('#businessVolume', '请输入年营业额', 'item-input-box');
      return;
    }

    var businessTimeVerify = getVerifyInfo('#businessTime', '请选择经营时间', 'item-input-box');

    if (!businessTimeVerify) {
      return;
    }

    $(this).addClass('btn-success');

    $('#businessChecked').addClass('checked-show');
  });

  $(document).on('click', '#formBtn', function () {
    var applyAmountVerify = $('#amount').val().trim(); // 申请金额
    var detailedAreaVerify = $('#detailedArea').val().trim(); // 详细地址
    var otherNameVerify = $('#otherName').val().trim(); // 紧急联系人-姓名
    var otherTelVerify = $('#otherTel').val().trim(); // 紧急联系人-手机号码

    if (!applyAmountVerify || applyAmountVerify.length === 0) {
      getVerifyInfo('#amount', '请输入申请金额', 'item-input-box');
      return;
    }

    var loanPurposeVerify = getVerifyInfo('#loanPurpose', '请选择贷款目的', 'item-input-box');

    if (!loanPurposeVerify) {
      return;
    }

    var martalStatusVerify = getVerifyInfo('#martalStatus', '请选择婚姻状况', 'item-input-box');

    if (!martalStatusVerify) {
      return;
    }

    var addressVerify = getVerifyInfo('#address', '请选择居住地址', 'item-input-box');

    if (!addressVerify) {
      return;
    }

    if (!detailedAreaVerify || detailedAreaVerify.length === 0) {
      getVerifyInfo('#detailedArea', '请输入详细地址', 'item-input-box');
      return;
    }

    if (!otherNameVerify || otherNameVerify.length === 0) {
      getVerifyInfo('#otherName', '请输入紧急联系人的姓名', 'item-input-box');
      return;
    }

    if (!otherTelVerify || otherTelVerify.length === 0) {
      getVerifyInfo('#otherTel', '请输入紧急联系人的手机号码', 'item-input-box');
      return;
    }

    var relationVerify = getVerifyInfo('#relation', '请输入与紧急联系人的关系', 'item-input-box');

    if (!relationVerify) {
      return;
    }

    if (!$('#companyChecked').hasClass('checked-show') || !$('#businessChecked').hasClass('checked-show')) {
      return;
    }
  });
});