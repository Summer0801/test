'use strict';

var BASEURL = 'http://10.18.33.3:8086';
var RETRIEVALURL = BASEURL + '/api/bi/company/name/retrieval/';
var UPLOADURL = '';

var API = {
  // 公司名称检索
  retrieval: function retrieval(val, callback) {
    $.ajax({
      data: {
        size: 10
      },
      type: 'get',
      url: RETRIEVALURL + val,
      success: function success(data) {
        callback(val, data);
      },
      errors: function errors(error) {
        console.log(error);
      }
    });
  },

  getUploadDate: function getUploadDate(parm, callback) {
    $.ajax({
      data: parm,
      type: 'post',
      url: UPLOADURL,
      success: function success(res) {
        callback(res.data);
      },
      errors: function errors(error) {
        console.log(error);
      }
    });
  }
};