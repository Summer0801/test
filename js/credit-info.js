'use strict';

$(function () {
  'use strict;';

  // 信用资料Json

  var creditInfoJson = {
    data: {
      title: '信用资料',
      items: [{
        componentName: '请认证基础信息（至少选择一项）',
        items: [{
          itemServerKey: 'BANK',
          itemServerName: null,
          itemName: '个人流水',
          itemType: 'bandData',
          itemIcon: 'img/uploaddata_icon8.svg',
          itemDesc: '',
          itemAuthen: '1',
          itemCategory: 'thirdparty',
          itemSupKey: null,
          itemSort: 1
        }, {
          itemServerKey: 'SS',
          itemServerName: null,
          itemName: '社保',
          itemType: 'ssData',
          itemIcon: 'img/uploaddata_icon6.svg',
          itemDesc: '',
          itemAuthen: '0',
          itemCategory: 'thirdparty',
          itemSupKey: null,
          itemSort: 2
        }, {
          itemServerKey: 'FUND',
          itemServerName: null,
          itemName: '公积金',
          itemType: 'fundData',
          itemIcon: 'img/uploaddata_icon7.svg',
          itemDesc: '',
          itemAuthen: '1',
          itemCategory: 'thirdparty',
          itemSupKey: null,
          itemSort: 3
        }],
        sort: 1
      }, {
        componentName: '请认证补充信息（至少选择一项）',
        items: [{
          itemServerKey: 'ONLINE',
          itemServerName: '淘宝/支付宝',
          itemName: '淘宝/支付宝',
          itemType: 'alipayData',
          itemIcon: 'img/uploaddata_icon9.svg',
          itemDesc: '',
          itemAuthen: '0',
          itemCategory: 'thirdparty',
          itemSupKey: null,
          itemSort: 1
        }, {
          itemServerKey: 'OPERATOR',
          itemServerName: '运营商',
          itemName: '运营商',
          itemType: 'operatorData',
          itemIcon: 'img/uploaddata_icon10.svg',
          itemDesc: '',
          itemAuthen: '0',
          itemCategory: 'thirdparty',
          itemSupKey: null,
          itemSort: 2
        }],
        sort: 2
      }]
    }
  };

  var initCreditInfo = function initCreditInfo(creditInfo) {
    var listDataItems = creditInfo.data.items;
    var formHtml = ''; //页面总html

    initNav(); // 渲染头部

    $(listDataItems).each(function (index, itemModels) {
      $.each(itemModels, function (index, submodel) {
        var formItemHtml = '';

        switch (index) {
          case 'componentName':
            formItemHtml += section_header(submodel);
            break;
          case 'items':
            formItemHtml += getItemListInfo(submodel);
            break;

          default:
            // 序号忽视
            break;
        }

        formHtml += formItemHtml;
      });
    });

    // 页面底部
    var btnHtml = '<div class="content">\n        <a class="btn apply-btn btn-default" \n        href="javascript: void(0);" \n        id="formBtn">\u786E\u5B9A</a>\n      </div>';
    $('' + formHtml + btnHtml).appendTo('.detailed-application');

    /**
     * 渲染页面顶部导航栏
     */
    function initNav() {
      var globalNav = '<div class="gn-header" \n          data-key="' + creditInfo.data.title + '">\n          <div class="gn-back"></div>\n          <div class="gn-title">' + creditInfo.data.title + '</div>\n          <div class="gn-menu"></div>\n        </div>';

      var navTemplate = '<div class="global-nav" \n          id="head">' + globalNav + '</div>\n          <div class="detailed-application credit-upload"></div>\n        </div>';

      $('#credit-info').append(navTemplate);
    }

    // 模块提示信息SECTION_HEADER
    function section_header(string) {
      return '<div class="subtitle">' + string + '</div>';
    }

    // 信息组
    function getItemListInfo(item) {
      var itemList = '';
      $.each(item, function (i, v) {
        itemList += getUploadData(v);
      });

      return itemList;
    }

    // 显示信息
    function getUploadData(item) {
      // console.log('item', item);
      var itemServerKey = item.itemServerKey,
          itemName = item.itemName,
          itemType = item.itemType,
          itemIcon = item.itemIcon,
          itemCategory = item.itemCategory,
          itemAuthen = item.itemAuthen;


      return '<div class="item-input-box">\n                <div class="select-box flex v-center upload-data" \n                  id="' + itemType + '"\n                  name="' + itemServerKey + '"\n                  data-category="' + itemCategory + '">\n                  <div class="data-icon flex v-center h-center">\n                    <img src="' + itemIcon + '" alt="null">\n                  </div>\n                  <div class="data-title">\n                    <div class="title-sup">' + itemName + '</div>\n                    <div class="title-sub">\u8BA4\u8BC1\u624B\u673A\u8FD0\u8425\u5546\u4FE1\u606F</div>\n                  </div>\n                  <div class="icon arrowright"></div>\n                  <div class="approve" \n                    style="display:' + (itemAuthen == '1' ? '' : 'none') + '"\n                  >\u5DF2\u8BA4\u8BC1</div>\n                </div>\n              </div>';
    }

    $(document).on('click', '.upload-data', function () {
      var id = $(this).attr('id');
      // console.log(id);
      API.getUploadDate(id, function (url) {
        return location.href = url;
      });
    });
  };

  // 页面初始化
  initCreditInfo(creditInfoJson);
});