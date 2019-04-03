'use strict';

// 图片上传
$(function () {
  var $ = jQuery;
  var $list = $('#fileList'); //存放图片集合
  var ratio = window.devicePixelRatio || 1; // 优化retina, 在retina下这个值是2
  var thumbnailWidth = 100 * ratio; // 缩略图大小
  var thumbnailHeight = 100 * ratio;
  var uploader = void 0; // Web Uploader实例

  // 显示进度条方法
  var showProgress = function showProgress(file, percentage) {
    // 文件上传过程中创建进度条实时显示。
    var $li = $('#' + file.id);
    var $closeBtn = $li.find('.img-close');
    var $progressModal = $li.find('.progress-modal');
    var $progressVal = $progressModal.find('.progress-txt');

    // 圈圈
    var $circle = $progressModal.find('.circle');
    var $right = $circle.find('.right');
    var $left = $circle.find('.left');

    if (percentage > 1) {
      percentage = 0;
      $circle.removeClass('clip-auto');
      $right.addClass('wth0');
    }
    if (percentage === 1) {
      $progressModal.remove();
      $closeBtn.show();
    } else if (percentage > 0.5) {
      $circle.addClass('clip-auto');
      $right.removeClass('wth0');
    }

    // 兼容性
    $left.css('-webkit-transform', 'rotate(' + 18 / 5 * percentage * 100 + 'deg)');
    $left.css('transform', 'rotate(' + 18 / 5 * percentage * 100 + 'deg)');
    $progressVal.text(parseInt(percentage * 100) + '%');
  };

  // 初始化Web Uploader
  uploader = WebUploader.create({
    auto: true, // 自动上传。

    // swf: BASE_URL + '/js/Uploader.swf', // swf文件路径

    server: window.location.origin, // 文件接收服务端。

    // 重复上传图片，true为可重复false为不可重复
    duplicate: false,

    thumb: {
      // 图片配置
      allowMagnify: true,
      crop: true
    },

    pick: '#filePicker', // 选择文件的按钮。可选。

    // 只允许选择文件，可选。
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    }
  });

  uploader.on('fileQueued', function (file) {
    // 当有文件添加进来的时候
    var $li = $('<div id="' + file.id + '" class="file-item thumbnail">\n        <img></img>\n        <div class="img-close"></div>\n        <div class= "modal-mode progress-modal">\n          <div class="modal-bg"></div>\n          <div class="progress-box">\n            <div class="progress">\n              <div class="circle">\n                <div class="percent left"></div>\n                <div class="percent right wth0"></div>\n              </div>\n              <div class="white-bg"></div>\n            </div>\n            <div class="progress-txt">0%</div>\n          </div>\n        </div>\n      </div>');
    var $img = $li.find('img');

    $list.prepend($li);

    // 创建缩略图
    uploader.makeThumb(file, function (error, src) {
      if (error) {
        $img.replaceWith('<span>不能预览</span>');
        return;
      }
      $img.attr('src', src);
    }, thumbnailWidth, thumbnailHeight);
  }).on('uploadProgress', function (file, percentage) {
    showProgress(file, percentage);
  }).on('uploadSuccess', function (file) {
    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    var $li = $('#' + file.id);
    var $closeBtn = $li.find('.img-close');
    var $progressModal = $li.find('.progress-modal');

    // 关闭进度条，显示关闭按钮
    $closeBtn.show();
    $progressModal.remove();
  }).on('uploadError', function (file) {
    // 文件上传失败，现实上传出错。
    var $li = $('#' + file.id);
    var $progress = $li.find('.progress');
    var $progressVal = $li.find('.progress-txt');

    $progress.remove(); //进度条隐藏
    $progressVal.text('上传失败');
  }).on('uploadComplete', function (file) {
    // 完成上传完了，成功或者失败，先删除进度条。
    $('#' + file.id).find('.progress').remove();
  });

  // 点击删除图片
  $(document).on('click', '.file-item .img-close', function () {
    var thisItem = $(this).parent('.file-item');

    uploader.removeFile(thisItem.attr('id'), true); //删除插件库文件
    thisItem.remove(); //删除页面Dom
  });
});