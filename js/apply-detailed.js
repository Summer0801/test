'use strict';

$(function () {
  'use strict;';
  var AJAXURL = 'http://172.21.129.1:8082/bd/appwap/compositeApply/pageData/cst_zh_apply01_fxs';

  $.ajax({
    url: AJAXURL,
    type: 'GET',
    dataType: 'json',
    success: function success(res) {
      console.log(res);
      var listData = res.data.models[0];
      initNav(listData);
      initPage(listData);
      // 初始化事件
      baseCtrl.baseInfo(listData);
    }
  });

  function initPage(listData) {
    var subModelsData = listData.subModels;

    var formHtml = '';
    var componentsType = {
      // 组件类型
      section_header: 'SECTION_HEADER',
      text: 'TEXT',
      number: 'NUMBER',
      select: 'SELECT',
      select_l1: 'SELECT_L1',
      select_l2: 'SELECT_L2',
      address: 'ADDRESS',
      entry_addr_hide: 'ENTRY_ADDR_HIDE',
      mergency_contact_person: 'MERGENCY_CONTACT_PERSON',
      vague_select: 'VAGUE_SELECT',
      company_telephone: 'COMPANY_TELEPHONE',
      date_select_l2: 'DATE_SELECT_L2'
    };

    subModelsData.map(function (submodel, index) {
      var formItemHtml = '';
      var heaherHtml = '';
      var components = submodel.components;

      components.map(function (v, i) {
        // console.log(i, v.type);
        var type = v.type; //获取推入类型

        switch (type) {
          case componentsType.section_header:
            heaherHtml = section_header(v);
            break;

          case componentsType.text:
            formItemHtml += input_number(v);
            break;

          case componentsType.number:
            formItemHtml += input_number(v);
            break;

          case componentsType.select:
            formItemHtml += input_select(v);
            break;

          case componentsType.select_l1:
            formItemHtml += input_select(v);
            break;

          case componentsType.select_l2:
            formItemHtml += input_selectL2(v);
            break;

          case componentsType.address:
            formItemHtml += input_address(v);
            break;

          case componentsType.entry_addr_hide:
            formItemHtml += entry_addr_hide(v);
            break;

          case componentsType.mergency_contact_person:
            formItemHtml += input_emergency(v);
            break;

          case componentsType.vague_select:
            formItemHtml += input_vague_select(v);
            break;

          case componentsType.company_telephone:
            formItemHtml += company_telephone(v);
            break;

          case componentsType.date_select_l2:
            formItemHtml += date_select_l2(v);
            break;

          default:
            break;
        }
      });

      if (formItemHtml.length == 0) {
        formHtml += '' + heaherHtml;
      } else {
        // 工作信息和生意信息
        if (submodel.key === 'cst_zh_work_info' || submodel.key === 'cst_zh_business_info') {
          formHtml += '<div class="container additional-info" \n            id="' + submodel.key + '" \n            data-key="' + submodel.key + '">\n            <div class="headline-box">\n              <div class="headline">' + submodel.name + '\n                <div class="dropdown"></div>\n                <div class="checked"></div>\n              </div>\n            </div>\n            <div class="content toggle-space"\n              data-key="' + submodel.key + '">' + formItemHtml + '\n            </div>\n          </div>';
        } else {
          formHtml += heaherHtml + '<div class="content additional-info"\n            data-key=' + submodel.key + '>' + formItemHtml + '\n          </div>';
        }
      }
    });

    $(formHtml + '<div class="content"><a class="btn" href="javascript: void(0);" id="formBtn">\u786E\u5B9A</a></div>').appendTo('.detailed-application');
  }

  // 事件初始化
  var baseCtrl = {
    baseInfo: function baseInfo(array) {
      // 事件初始化
      $(document).on('click', '.select_columns_1', function () {
        var answerChoice = $(this).attr('data-answerchoice');
        var $name = $(this).attr('data-name');
        var $data = getAnswerChoice(answerChoice);

        $data.length > 0 && $(this).modalPopup({
          title: $name,
          data: $data,
          columns: 1,
          callback: isControl($(this), array)
        });
      });

      // 二级选择
      $(document).on('click', '.select_columns_2', function () {
        var answerChoice = $(this).attr('data-answerchoice');
        var $name = $(this).attr('data-name');
        var $data = getAnswerChoice(answerChoice).map(function (_ref) {
          var name = _ref.name,
              code = _ref.code,
              children = _ref.children;
          return {
            code: code,
            name: name,
            children: children
          };
        });

        // 吊起弹框
        $data.length > 0 && $(this).modalPopup({
          title: $name,
          data: $data,
          columns: 2
        });
      });

      // 地区选择(三级)
      $(document).on('click', '.select_columns_addr', function () {
        var $name = $(this).attr('data-name');
        $(this).modalPopup({
          title: $name,
          data: provinces(3),
          columns: 3
        });
      });

      // 模糊搜索
      $(document).on('click', '.select_vague', function () {
        $(this).addressSelect();
      });

      // 日期选择(二级)
      $(document).on('click', '.date_select_l2', function () {
        var $name = $(this).attr('data-name');
        var $data = getDateJson().map(function (_ref2) {
          var name = _ref2.name,
              code = _ref2.code,
              children = _ref2.children;
          return {
            code: code,
            name: name,
            children: children
          };
        });
        $(this).modalPopup({
          title: $name,
          data: $data,
          columns: 2
        });
      });

      $(document).on('click', '#companyTel, #enterpriseTel', function () {
        $(this).phoneFormat();
      });

      // 输入校验
      $(document).on('blur', '.input_number', function () {
        var flag = getVerifyValue($(this));
        if (!flag) {
          return false;
        }
      });

      // 切换工作信息和生意信息的可见性
      $(document).on('click', '.container .headline-box', function () {
        $(this).parent().siblings().removeClass('toggle');
        $('.container .toggle-space').slideUp(150);

        $(this).parent().hasClass('toggle') ? $(this).parent().removeClass('toggle').end().next().slideUp(150) : $(this).parent().addClass('toggle').end().next().slideDown(150);
      });

      // 紧急联系人交互效果
      $(document).ready(function () {
        $.each($('.top-row .input'), function (i, inputs) {
          var $this = $(inputs);
          var label = $this.prev('.label');

          $this.val().trim() === '' ? label.removeClass('active') : label.addClass('active');
        });
      }).on('keyup', '.top-row .input', function () {
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
        label.addClass('active');
      });

      // 确定提交
      $(document).on('click', '#formBtn', function () {
        // alert('OK');
        var applyFlag = applyAllVerify(); //综合校验

        if (!applyFlag) {
          return false;
        } else {
          var $additionalInfo = $('form .additional-info');
          var allObj = [];
          $.each($additionalInfo, function (i, v) {
            var obj = {};
            var $list = [];
            $.each($(v).find('input'), function (j, k) {
              var childObj = {};
              childObj[$(k).attr('id')] = $(k).attr('data-num') ? $(k).attr('data-num') : $(k).val();
              $list.push(childObj);
            });
            obj[$(v).attr('data-key')] = $list;
            allObj.push(JSON.stringify(obj));
          });
          // const jsonData = $('form').serializeArray();
          console.log('验证完了走你！！', allObj);

          $.ajax({
            type: 'POST',
            url: 'http://172.21.129.1:8082/bd/appwap/compositeApply?pageKey=cst_zh_apply01_fxs',
            data: jsonData,
            contentType: 'application/json',
            dataType: 'json',
            success: function success(data) {
              console.log(data);
              if (data.status == 1) {
                console.log(data.msg);
              } else {
                console.log(data.msg);
              }
            }
          });
        }
      });
    }
  };

  /**
   * 渲染页面顶部导航栏
   */
  function initNav(data) {
    var globalNav = data.isOnlyShow == 0 ? '<div class="gn-header" data-key="' + data.key + '">\n          <div class="gn-back"></div>\n          <div class="gn-title">' + data.name + '</div>\n          <div class="gn-menu"></div>\n        </div>' : '';
    var navTemplate = '<div class="global-nav" \n        id="head">' + globalNav + '</div><form class="detailed-application section"></form>';
    $('#detailed-application').append(navTemplate);
  }

  // 模块提示信息SECTION_HEADER
  function section_header(obj) {
    var item = obj.columns[0];
    return '<div class="subhead">' + item.name + '</div>';
  }

  // 类型为NUMBER
  function input_number(obj) {
    var item = obj.columns[0];
    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        inputUnit = item.inputUnit,
        isControl = item.isControl,
        isRequire = item.isRequire,
        key = item.key,
        keyboardType = item.keyboardType,
        length = item.length,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    return (/*html*/'<div class="item-input-box">\n          <div class="input-box flex v-center">\n            <label class="input-key" for="' + key + '">' + name + '</label>\n            <input class="input-value input_number"\n              id="' + key + '"\n              name="' + key + '" \n              type="' + (keyboardType == 'number' ? 'tel' : keyboardType) + '" \n              placeholder="' + placeholder + '"\n              value="' + defaultValue + '"  \n              maxLength="' + (length === 0 ? '' : length) + '"\n              data-name="' + name + '"\n              data-answerchoice="' + answerChoice + '"\n              data-iscontrol="' + isControl + '"\n              data-isrequire="' + isRequire + '"\n              data-regexrule="' + regexRule + '"\n              data-regexrulemsg="' + regexRuleMsg + '"\n              autocomplete="off">\n              <span class="suffix">' + inputUnit + '</span>\n          </div>\n          <div class="error-box">' + regexRuleMsg + '</div>\n        </div>'
    );
  }

  // MERGENCY_CONTACT_PERSON紧急联系人
  function input_emergency(obj) {
    var item = obj.columns;
    // console.log(item);

    return (/*html*/'<div class="item-input-box">\n      <div class="top-row">' + item[0].name + '</div>\n      <div class="top-row flex space-between">\n        <div class="field-wrap">\n          <label class="label" for=' + item[0].key + '>' + item[0].name + '</label>\n          <input class="input input-value input_emergency" \n            id=' + item[0].key + ' \n            name="' + item[0].key + '"\n            type="text" \n            value="' + (!item[0].defaultValue ? '' : item[0].defaultValue) + '" \n            data-name = "' + item[0].name + '"\n            data-iscontrol="' + item[0].isControl + '"\n            data-isrequire="' + item[0].isRequire + '" \n            data-regexrule="' + item[0].regexRule + '"\n            data-regexrulemsg="' + item[0].regexRuleMsg + '"\n            autocomplete="off"/>\n        </div>\n        <div class="field-wrap">\n          <label class="label" for=' + item[1].key + '>' + item[1].name + '</label>\n          <input class="input input-value" \n            id=' + item[1].key + ' \n            name="' + item[1].key + '"\n            type="tel" \n            maxLength="' + (length === 0 ? '' : length) + '" \n            value="' + (!item[1].defaultValue ? '' : item[1].defaultValue) + '" \n            data-name = "' + item[1].name + '"\n            data-iscontrol="' + item[1].isControl + '"\n            data-isrequire="' + item[1].isRequire + '" \n            data-regexrule="' + item[1].regexRule + '"\n            data-regexrulemsg="' + item[1].regexRuleMsg + '" \n            autocomplete="off">\n        </div>\n      </div>\n      <div class="error-box">' + item[0].regexRuleMsg + '</div>\n    </div>'
    );
  }

  // 类型为SELECT/SELECT_L1
  function input_select(obj) {
    var isControlled = obj.isControlled,
        key = obj.key; //控制受控组件参数

    var item = obj.columns[0];
    // console.log(item);
    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    return (/*html*/'<div class="item-input-box" \n      id=' + key + ' \n      style="display:' + (isControlled == 0 ? '' : 'none') + '" >\n      <div class="select-box flex v-center">\n        <label class="input-key" for="' + item.key + '">' + name + '</label>\n        <input class="input-value select_columns_1" \n          id="' + item.key + '" \n          name="' + item.key + '" \n          type="' + keyboardType + '" \n          value="' + defaultValue + '" \n          placeholder="' + placeholder + '" \n          data-name="' + name + '"\n          data-answerchoice="' + answerChoice + '"\n          data-iscontrol="' + isControl + '"\n          data-isrequire="' + isRequire + '"\n          data-regexrule="' + regexRule + '"\n          data-regexrulemsg="' + regexRuleMsg + '"\n          readonly autocomplete="off">\n        <div class="icon"></div>\n      </div>\n      <div class="error-box">' + item.regexRuleMsg + '</div>\n    </div>'
    );
  }

  // 类型为SELECT_L2
  function input_selectL2(obj) {
    var isControlled = obj.isControlled,
        key = obj.key; //控制受控组件参数

    var item = obj.columns[0];
    // console.log(item);
    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    return (/*html*/'<div class="item-input-box" id=' + key + ' style="display:' + (isControlled == 0 ? '' : 'none') + '" >\n    <div class="select-box flex v-center">\n      <label class="input-key" for="' + item.key + '">' + name + '</label>\n      <input class="input-value select_columns_2" \n        id="' + item.key + '" \n        type="' + keyboardType + '" \n        name="' + item.key + '" \n        value="' + defaultValue + '" \n        placeholder="' + placeholder + '" \n        data-name="' + name + '"\n        data-answerchoice="' + answerChoice + '"\n        data-iscontrol="' + isControl + '"\n        data-isrequire="' + isRequire + '"\n        data-regexrule="' + regexRule + '"\n        data-regexrulemsg="' + regexRuleMsg + '"\n        readonly autocomplete="off">\n      <div class="icon"></div>\n    </div>\n    <div class="error-box">' + item.regexRuleMsg + '</div>\n  </div>'
    );
  }

  // 类型为ADDRESS地址
  function input_address(obj) {
    var isControlled = obj.isControlled,
        key = obj.key; //控制受控组件参数

    var item = obj.columns[0];
    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    return (/*html*/'<div class="item-input-box" \n      id=' + key + ' \n      style="display:' + (isControlled == 0 ? '' : 'none') + '" >\n      <div class="select-box flex v-center">\n        <label class="input-key" for="' + item.key + '">' + name + '</label>\n        <input class="input-value select_columns_addr" \n          id="' + item.key + '" \n          type="' + keyboardType + '" \n          name="' + item.key + '"\n          value="' + defaultValue + '" \n          placeholder="' + placeholder + '" \n          data-name="' + name + '"\n          data-answerchoice="' + answerChoice + '"\n          data-iscontrol="' + isControl + '"\n          data-isrequire="' + isRequire + '"\n          data-regexrule="' + regexRule + '"\n          data-regexrulemsg="' + regexRuleMsg + '"\n          readonly autocomplete="off">\n        <div class="icon"></div>\n      </div>\n      <div class="error-box">' + item.regexRuleMsg + '</div>\n    </div>'
    );
  }

  // 类型为VAGUE_SELECT 模糊查询
  function input_vague_select(obj) {
    var item = obj.columns[0];

    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;

    return (/*html*/'<div class="item-input-box">\n      <div class="select-box flex v-center">\n        <label class="input-key" for="' + item.key + '">' + name + '</label>\n        <input class="input-value select_vague" \n          id="' + item.key + '" \n          name="' + item.key + '" \n          data-answerchoice="' + answerChoice + '"\n          data-iscontrol="' + isControl + '"\n          data-isrequire="' + isRequire + '"\n          data-regexrule="' + regexRule + '"\n          data-regexrulemsg="' + regexRuleMsg + '"\n          data-name="' + name + '"\n          type="' + keyboardType + '" \n          placeholder="' + placeholder + '" \n          value="' + defaultValue + '" \n          readonly autocomplete="off">\n        <div class="icon arrow-right"></div>\n      </div>\n      <div class="error-box">' + regexRuleMsg + '</div>\n    </div>'
    );
  }

  // 类型为DATE_SELECT_L2
  function date_select_l2(obj) {
    var item = obj.columns[0];
    var answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        key = item.key,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    return (/*html*/'\n      <div class="item-input-box">\n        <div class="select-box flex v-center">\n          <label class="input-key" for="' + key + '">' + name + '</label>\n          <input\n            class="input-value date_select_l2"\n            id="' + key + '"\n            name="' + item.key + '"\n            type="' + keyboardType + '"\n            placeholder="' + placeholder + '"\n            value="' + defaultValue + '"\n            data-name="' + name + '"\n            data-answerchoice="' + answerChoice + '"\n            data-iscontrol="' + isControl + '"\n            data-isrequire="' + isRequire + '"\n            data-regexrule="' + regexRule + '"\n            data-regexrulemsg="' + regexRuleMsg + '"\n            data-type="date"\n            readonly\n            autocomplete="off"\n          />\n          <div class="icon"></div>\n        </div>\n        <div class="error-box">' + regexRuleMsg + '</div>\n      </div>\n    '
    );
  }

  // 类型为COMPANY_TELEPHONE
  function company_telephone(obj) {
    var item = obj.columns[0];
    var key = item.key,
        answerChoice = item.answerChoice,
        defaultValue = item.defaultValue,
        isControl = item.isControl,
        isRequire = item.isRequire,
        keyboardType = item.keyboardType,
        name = item.name,
        placeholder = item.placeholder,
        regexRule = item.regexRule,
        regexRuleMsg = item.regexRuleMsg;


    if (item.dataTypeCode == 'STRING') {
      return (/*html*/'\n        <div class="item-input-box">\n          <div class="select-box flex v-center">\n            <label class="input-key" for="' + key + '">' + name + '</label>\n            <input\n              class="input-value company_telephone"\n              id="' + key + '"\n              name="' + item.key + '"\n              type="text"\n              placeholder="' + placeholder + '"\n              value="' + defaultValue + '"\n              data-name="' + name + '"\n              data-answerchoice="' + answerChoice + '"\n              data-keyboardtype="' + keyboardType + '"\n              data-iscontrol="' + isControl + '"\n              data-isrequire="' + isRequire + '"\n              data-regexrule="' + regexRule + '"\n              data-regexrulemsg="' + regexRuleMsg + '"\n              readonly\n              autocomplete="off"\n            />\n            <div class="icon"></div>\n          </div>\n          <div class="error-box">' + regexRuleMsg + '</div>\n        </div>\n      '
      );
    }
  }

  // 办理城市--类型为ENTRY_ADDR_HIDE
  function entry_addr_hide(obj) {
    var item = obj.columns[0];

    if (item.dataTypeCode == 'STRING') {
      return (/*html*/'\n        <div class="item-input-box" style="display: block;">\n          <div class="select-box flex v-center">\n            <label class="input-key" for="' + item.key + '">' + item.name + '</label>\n            <input class="input-value" id="' + item.key + '"\n            name="" data-answerchoice="' + item.answerChoice + '"\n            data-name="' + item.name + '" type="' + item.keyboardType + '"\n            placeholder="' + item.placeholder + '" value="' + item.defaultValue + '"\n            readonly autocomplete="off">\n            <div class="icon"></div>\n          </div>\n          <div class="error-box">"' + item.regexRuleMsg + '</div>\n        </div>\n      '
      );
    }
  }
});

/**
 * 根据标志查找字典
 * @param {string} answerChoic
 */
function getAnswerChoice(answerChoic) {
  var selectData = sysDictResult.sysDictList.filter(function (item) {
    return item.typeCode == answerChoic;
  }).map(function (_ref3) {
    var code = _ref3.code,
        name = _ref3.name;
    return { code: code, name: name };
  });

  $.each(selectData, function (i, v) {
    var children = sysDictResult.sysDictList.filter(function (item) {
      return item.typeCode === v.code;
    }).map(function (_ref4) {
      var code = _ref4.code,
          name = _ref4.name;
      return { code: code, name: name };
    });
    v.children = children;
  });

  return selectData;
}

/**
 * 循环获取时间假数据
 */
function getDateJson() {
  var entryTime = [];
  var _year = new Date().getFullYear();

  $.each(Array(70), function (i, v) {
    var obj = {};
    obj.code = Number(_year - i);
    obj.name = Number(_year - i) + '年';
    entryTime.push(obj);
  });

  entryTime.map(function (item) {
    var detail = [];
    $.each(Array(12), function (j, k) {
      var obj = {};
      obj.code = item.code + '-' + (Number(j + 1) < 10 ? '0' + Number(j + 1) : '' + Number(j + 1));
      obj.name = Number(j + 1) + '月';
      detail.push(obj);
    });
    item.children = detail;

    return item;
  });

  return entryTime;
}

/**
 * 下拉组件关联
 * @param {*} params 当前环境this
 */
function isControl(params, ARR) {
  // console.log(params);
  var _targetKey = params.attr('id');
  var _targetValue = params.attr('data-num');
  var isControl = params.attr('data-iscontrol'); //是否受控

  if (isControl == '1') {
    var dynamicControls = ARR.dynamicControls; //受控数组
    var filterControlList = dynamicControls.filter(function (item) {
      return item.targetKey == _targetKey;
    });

    //关联其他
    if (filterControlList.length > 0) {
      $.each(filterControlList, function (index, item) {
        var sourceKeyList = item.sourceKey;
        var verify = $.fn.regExpCheck({
          isRequire: true,
          checkRule: item.targetRule,
          value: _targetValue
        });
        if (verify) {
          $.each(sourceKeyList, function (i, v) {
            $('#' + v).show();
          });
        } else {
          $.each(sourceKeyList, function (i, v) {
            $('#' + v).hide();
          });
        }
      });
    }
  }
}

/**
 * 获取验证结果
 * @param {*} item 当前节点
 */
function getVerifyValue(item) {
  var _this = $(item);
  var value = _this.val();
  var title = _this.attr('data-name');
  var parentDom = _this.parents('.item-input-box');
  var errorBox = parentDom.find('.error-box');
  var isRequire = _this.attr('data-isrequire') == 1 ? true : false;
  var checkRule = _this.attr('data-regexrule') == 'undefined' ? 'null' : _this.attr('data-regexrule');
  var regexRuleMsg = _this.attr('data-regexrulemsg');

  var verifyVal = $.fn.regExpCheck({
    isRequire: isRequire,
    checkRule: checkRule,
    value: value
  });

  if (!verifyVal) {
    // console.log(regexRuleMsg);
    regexRuleMsg && regexRuleMsg != 'undefined' ? errorBox.text(regexRuleMsg) : errorBox.text('\u8BF7\u9009\u62E9' + title);
    parentDom.addClass('error-info');
    return false;
  } else {
    parentDom.removeClass('error-info');
    return true;
  }
}

/**
 * 校验标志
 * @param {Array} filterInputs 数组集合
 * @param {string} animateFlag
 */
function getVerifyFalg(filterInputs, animateFlag) {
  var flagArrHas = [];
  // 校验必填信息
  $.each(filterInputs, function (index, item) {
    var flag = getVerifyValue(item);
    flagArrHas.push(flag);
    if (!flag) {
      if (!animateFlag) {
        $('html,body').animate({
          scrollTop: $(item).offset().top - 44
        });
      }
      return false;
    }
  });

  if (flagArrHas.indexOf(false) > -1) {
    return false;
  } else {
    return true;
  }
}

// 申请综合验证
function applyAllVerify() {
  var businessDom = $('#cst_zh_business_info');
  var workDom = $('#cst_zh_work_info');
  var formDom = $('.detailed-application');

  if (businessDom.length > 0 && workDom.length > 0) {
    // 生意人士与工作信息同时存在
    var formInputs = formDom.find('input');
    var exceptInputs = $('#cst_zh_work_info input, #cst_zh_business_info input');
    var filterInputs = []; // 基本信息

    for (var i = 0; i < formInputs.length; i++) {
      var obj = formInputs[i];
      var num = obj.id;
      var isExist = false;
      for (var j = 0; j < exceptInputs.length; j++) {
        var aj = exceptInputs[j];
        var n = aj.id;
        if (n == num) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        filterInputs.push(obj);
      }
    }

    // 基本信息验证
    var flag = getVerifyFalg(filterInputs);
    console.log('基本验证 :', flag);
    if (!flag) {
      return false;
    } else {
      var workInputs = workDom.find('input');
      var workFlag = getVerifyFalg(workInputs, 'noAnmain');

      if (!workFlag) {
        // 工作信息
        var businessInputs = businessDom.find('input');
        var businessFlag = getVerifyFalg(businessInputs, 'noAnmain');

        if (!businessFlag) {
          // 工作信息与生意信息都没通过
          $(businessDom).find('.checked').removeClass('checked-show');
          $(workDom).find('.checked').removeClass('checked-show');
          $('html,body').animate({
            scrollTop: $('#cst_zh_work_info').offset().top - 44
          });

          var m = new MessageModel({
            content: '工作信息与生意信息至少填一项'
          });

          m.createHtml();
          return false;
        } else {
          console.log('生意信息完成走你！！！');
          $(businessDom).find('.checked').addClass('checked-show');
          return true;
        }
      } else {
        console.log('工作信息完成走你！！！');

        var _businessInputs = businessDom.find('input');
        var _businessFlag = getVerifyFalg(_businessInputs, 'noAnmain');

        if (_businessFlag) {
          // 工作信息与生意信息都通过
          $(businessDom).find('.checked').addClass('checked-show');
        } else {
          // 工作信息通过，生意信息未通过
          $(businessDom).find('.checked').removeClass('checked-show');
        }

        $(workDom).find('.checked').addClass('checked-show');
        return true;
      }
    }
  } else {
    // 一般情况
    var allformInputs = formDom.find('input');
    // 基本信息验证
    var allFlag = getVerifyFalg(allformInputs);

    if (!allFlag) {
      return false;
    } else {
      return true;
    }
  }
}