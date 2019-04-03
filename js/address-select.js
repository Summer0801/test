'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
  var addressSelect = function () {
    function addressSelect(id) {
      _classCallCheck(this, addressSelect);

      this.id = id;
      this.time = null;
      // this.url = 'http://10.18.33.3:8086';
      this.oldVal = '';
      this.winResize = null;
    }

    _createClass(addressSelect, [{
      key: 'render',
      value: function render() {
        this.template = '\n        <div class="address-select">\n          <div class="select-content">\n            <div class="global-nav select-head">\n              <div class="gn-back back"></div>\n              <div class="input">\n                <input type="text"><img class="cancel cursor" src="img/comprehensive_delete.svg">\n              </div>\n              <div class="confirm cursor">\u786E\u5B9A</div>\n            </div>\n            <div class="select-list">\n              <ul>\n                \n              </ul>\n            </div>\n          </div>\n        </div>\n      ';

        $(this.template).appendTo($('body'));

        $('.address-select input').focus();

        $('.address-select').addClass('active');

        $('html,body').scrollTop(0);
      }
    }, {
      key: 'show',
      value: function show() {
        var that = this;
        var $parent = $('#' + that.id);
        var oVal = $parent.val().trim();

        this.winResize = $parent.maskWinResize({
          parentId: that.id,
          headId: 'head'
        });
        this.render();

        this.bindEvent();

        if (oVal != '') {
          $('.address-select input').val(oVal);

          that.getList(oVal);
        }
      }
    }, {
      key: 'hide',
      value: function hide() {
        // eslint-disable-next-line no-unused-vars
        var that = this;
        var parentName = '.address-select';

        $(parentName).removeClass('active');

        setTimeout(function () {
          $(parentName).remove();

          that = null;
        }, 300);

        $(document).unbind('click' + parentName).unbind('keyup' + parentName).unbind('change' + parentName);

        this.winResize.back();
      }
    }, {
      key: 'getList',
      value: function getList(val) {
        var that = this;
        API.retrieval(val, function (val, data) {
          that.oldVal = val;
          that.listRender(data.data, val);
        });

        // $.ajax({
        //   data: {
        //     size: 10,
        //   },
        //   type: 'get',
        //   url: that.url + '/api/bi/company/name/retrieval/' + val,
        //   success: function(data) {
        //     that.oldVal = val;

        //     that.listRender(data.data, val);
        //   },
        // });
      }
    }, {
      key: 'bindEvent',
      value: function bindEvent() {
        var that = this;
        var parentName = '.address-select';

        $(document).on('keyup' + parentName, parentName + ' input', function () {
          clearTimeout(that.time);
          var oThis = $(this);
          var oVal = oThis.val().trim();

          if (oVal != '') {
            $(parentName + ' .cancel').show();

            that.time = setTimeout(function () {
              if (oVal != that.oldVal) {
                that.getList(oVal);
              }
            }, 500);
          } else {
            $(parentName + ' .cancel').hide();
          }
        }).on('click' + parentName, parentName + ' .cancel', function () {
          $(parentName + ' input').val('').focus();

          $(parentName + ' .select-list ul').html('');

          $(this).hide();
        }).on('click' + parentName, parentName + ' .select-list li', function () {
          if (!$(this).hasClass('active')) {
            $(this).siblings().removeClass('active').end().addClass('active');

            $(parentName + ' input').val($(this).text());

            that.getList($(this).text());
          }
        }).on('click' + parentName, parentName + ' .confirm', function () {
          $('#' + that.id).val($(parentName + ' input').val());

          that.hide();
        }).on('click' + parentName, parentName + ' .back', function () {
          that.hide();
        });
      }
    }, {
      key: 'listRender',
      value: function listRender(data, oVal) {
        var oNames = [];
        var ulHtml = '';
        var isInString = false;

        if (data && data.names && data.names.length != 0) {
          oNames = data.names;

          oNames.map(function (val) {
            ulHtml += '<li>';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = val[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var s = _step.value;

                isInString = false;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = oVal[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var oS = _step2.value;

                    if (!isInString) {
                      if (s == oS) {
                        ulHtml += '<span>' + s + '</span>';

                        isInString = true;
                      }
                    }
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }

                !isInString && (ulHtml += '' + s);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            ulHtml += '<img src="./../img/comprehensive_icon_choice@3x.png"/></li>';

            $('.address-select .select-list ul').html(ulHtml);
          });
        }
      }
    }]);

    return addressSelect;
  }();

  $.fn.addressSelect = function () {
    var id = $(this).attr('id');

    if (id && $(this).is('input')) {
      return new addressSelect(id).show();
    } else {
      throw new Error('请用有id名的input标签，谢谢————地址名称插件');
    }
  };
})(jQuery);