//高重用性工具包即可放在此js中
if (typeof (Helper) === "undefined" || !Helper) {
  var Helper = {
    version: "1.0"
  };
}

//同盾验证
document.write("<script language='javascript' src='/js/tongdun.js'></script>");
// 项目根路径
document.write('<script language="javascript" src="/writeConfigJs.htm"></script>');

(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth < 640) {
        docEl.style.fontSize = Math.floor(16 * (clientWidth / 375)) + "px";
      } else {
        docEl.style.fontSize = 16 * (640 / 320) + "px";
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

// 定义util工具库
var util = {}

// 获取url参数返回json
util.hrefSplit = function (str) {
  var tagIndex = str.indexOf('?');
  if (tagIndex === -1) {
    return {};
  }
  var arrStr = str.substr(tagIndex + 1);
  arrStr = arrStr.split("&");
  var strJson = {};
  for (var i = 0; i < arrStr.length; i++) {
    var tag2Index = arrStr[i].indexOf('=');
    strJson[arrStr[i].substr(0, tag2Index)] = arrStr[i].substr(tag2Index + 1);
  }
  return strJson;
}


//获取url参数  判断是否显示头部 title
function GetRequest_title() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

var Request = undefined;
Request = GetRequest_title();
var title = Request["title"];


// 获取屏幕尺寸
util.getScreenWidth = function () {
  return document.documentElement.clientWidth;
}
util.getScreenHeight = function () {
  return document.documentElement.clientHeight;
}
util.alert = function (text, cb) {
  $('body').append('<div class="util_alert_bg"></div><div class="weui_dialog weui_dialog_visible"><div class="weui_dialog_bd">' + text + '</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog primary">确定</a></div></div>');
  $('.weui_dialog_ft').bind('click', function () {
    $('.util_alert_bg,.weui_dialog').remove();
    cb();
  })
}
util.confirm = function (text, cb01, cb02) {
  cb01 = cb01 || function () { }
  cb02 = cb02 || function () { }
  $('body').append('<div class="util_alert_bg"></div><div class="weui_dialog weui_dialog_visible"><div class="weui_dialog_bd">' + text + '</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog primary confirm_no">取消</a><a href="javascript:;" class="weui_btn_dialog primary confirm_ok">确定</a></div></div>');
  $('.weui_dialog_ft .confirm_ok').bind('click', function () {
    $('.util_alert_bg,.weui_dialog').remove();
    cb01();
  })
  $('.weui_dialog_ft .confirm_no').bind('click', function () {
    $('.util_alert_bg,.weui_dialog').remove();
    cb02();
  })
}
// btn1Text 点击执行cb02 & btn2Text 点击执行cb01
util.confirmAct = function (text, btn1Text, btn2Text, cb01, cb02) {
  cb01 = cb01 || function () { }
  cb02 = cb02 || function () { }
  $('body').append('<div class="util_alert_bg"></div><div class="weui_dialog weui_dialog_visible"><div class="weui_dialog_bd">' + text + '</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog primary confirm_no">' + btn1Text + '</a><a href="javascript:;" class="weui_btn_dialog primary confirm_ok">' + btn2Text + '</a></div></div>');
  $('.weui_dialog_ft .confirm_ok').bind('click', function () {
    $('.util_alert_bg,.weui_dialog').remove();
    cb01();
  })
  $('.weui_dialog_ft .confirm_no').bind('click', function () {
    $('.util_alert_bg,.weui_dialog').remove();
    cb02();
  })
}
util.toast = (function (text) {
  var isShow = false;
  return function (text) {
    if (!isShow) {
      $('body').append('<div class="util_toast_box"><div class="util_toast">' + text + '</div></div>');
      setTimeout(function () {
        $('.util_toast').css('transform', 'scale(1)');
      }, 0);
      isShow = true;
      var toastTime = setTimeout(function () {
        //$('.util_toast').css('transform','scale(0.8)');
        $('.util_toast_box,.layer_bg').remove();
        isShow = false;
      }, 2000);
    }
  }
}());

// 判断是否为空
util.isEmpty = function (value) {
  if (typeof (value) === 'undefined' || value === null || value.trim() === "") {
    return true;
  } else {
    return false;
  }
};
// 手机号格式判断
util.checkPhone = function (val) {
  if (this.isEmpty(val)) {
    return '手机号不能为空';
  }
  if (!this.checkTelePhone(val)) {
    return '请输入正确的手机号';
  }
  return true;
};
//密码格式判断
util.checkPsw = function (val) {
  if (this.isEmpty(val)) {
    return '密码不能为空';
  }
  if (val.length < 6) {
    return '密码为6-16位字符，区分大小写';
  }
  return true;
};
// 图形验证码格式判断
util.checkPictureCode = function (val) {
  if (this.isEmpty(val)) {
    return '图形验证码不能为空';
  }
  if (!this.checkMcode(val)) {
    return '图形验证码格式不正确';
  }
  return true;
}
// 手机验证码格式判断
util.checkPhoneCode = function (val) {
  if (this.isEmpty(val)) {
    return '手机验证码不能为空';
  }
  if (!this.checkMcode(val)) {
    return '手机验证码格式不正确';
  }
  return true;
}
// 手机号码格式判断
util.checkTelePhone = function (val) {
  return /^0?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/.test(val);
};
// 密码格式判断
util.checkPassword = function (val) {
  return /^[a-zA-Z0-9]{6,16}$/.test(val);
};
// 短信验证码格式判断
util.checkCaptcha = function (val) {
  return /^\d{4,10}$/.test(val);
};
// 四位数字格式判断
util.checkMcode = function (val) {
  return /^\d{4}$/.test(val);
};
//金额必须是数字并且最多精确到分
util.isTwoFloat = function (s) {
  var exp = new RegExp(/^-?\d+\.?\d{0,2}$/);
  return exp.test(s);
};

//去掉所有的html标记
util.removeHTMLTag = function (str) {
  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
  str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
  return str;
}

//前面或者后面‘length’位用‘mask’代替 ‘fromBegin’为true替换前面反之替换后面
//var str = '123456789';
//console.log(replaceChars(str,5,false,'*'));  
util.replaceChars = function (str, length, fromBegin, mask) {
  mask = mask ? mask : '*';
  var replacement = '';
  for (var i = 0; i < length; i++) {
    replacement += mask;
  }
  if (fromBegin) {
    var regexp = new RegExp('.{1,' + length + '}');
    return str.replace(regexp, replacement);
  } else {
    var regexp = new RegExp('.{' + (str.length - length) + ',' + str.length + '}');
    return str.substring(0, (str.length - length)) + str.replace(regexp, replacement);
  }
}
//手机号脱敏处理
//第‘start’位开始长度为‘length’
util.phoneRepalceMask = function(phone,start,length){
  var length = length ? length : 4;
  var mask = '';
  for(var i=0;i<length;i++){
    mask += '*';
  }
  var regexp = new RegExp('.{'+ (start + length-1) + '}');
  return phone.substring(0,start-1) + phone.replace(regexp, mask);
}

// 获取url参数
util.getUrlParam = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

//分割千分位数字
util.toThousands = function (num) {
  var num = (num || 0).toString(), num2 = "", result = '';
  if (num.indexOf(".") != -1) {
    nums = num.split(".");
    num = nums[0];
    num2 = "." + nums[1];
  }
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result + num2; }
  return result;
}

// 登录跳转
util.loginLink = function (time, userid, username) {
  var _self = this;
  var urlSearch = this.hrefSplit(window.location.href);
  if (urlSearch.bUrl === undefined || urlSearch.bUrl === '') {
    setTimeout(function () {
      window.location.href = '/src/index/index.html';
    }, time);
  } else {
    if (urlSearch.bUrl.indexOf('mylinkbuy.com') === -1 || urlSearch.state === undefined) {
      setTimeout(function () {
        window.location.href = _self.hrefSplit(window.location.href).bUrl;
      }, time);
    } else {
      window.location.href = urlSearch.bUrl + '?userId=' + userid + '&mobile=' + username + '&state=' + urlSearch.state;
    }
  }
}
// 一般跳转
util.baseLink = function (url, time) {
  setTimeout(function () {
    window.location.href = url;
  }, time)
}
//获取url中的参数
util.getRequest = function (url, name) {
  var url = window.location.href;
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
// 分转元
util.fenToYuan = function (value) {
  if (!value) return ''
  value = value / 100;
  return value;
}
// 获取当前年份
util.getCurYear = function () {
  var date = new Date();
  return date.getFullYear();
}
// 获取当前月份
util.getCurMonth = function () {
  var date = new Date();
  return date.getMonth();
}
// 获取当日星期天数 0-6
util.getCurDay = function () {
  var date = new Date();
  return date.getDay();
}
// 获取当日哪一天 0-31
util.getCurDate = function () {
  var date = new Date();
  return date.getDate();
}
// 获取某月天数
util.getMonthNum = function (year, month) {
  var date = new Date(year, month, 0);
  return date.getDate();
}
// 获取某月第一天星期几
util.getWeenDay = function (year, month) {
  var date = new Date(year, month, 01);
  return date.getDay();
}
//月份格式化两位
util.MonthToTwoLength = function (num) {
  var str = '';
  if (!isNaN(num)) {
    str = num.toString();
  }
  if (str.length === 1) {
    return '0' + str;
  } else {
    return str;
  }
}
//微信分享工具类
util.wxShareMain = function (shareCont) {
  var isDebug = shareCont.debug;
  var wxShareSign;
  if (typeof (shareCont.debug) === 'undefined' || shareCont.debug === "") {
    isDebug = false;
  }
  $.ajax({
    url: Helper.basePath + '/weixinCore/getjsapiTikcet.htm',
    type: 'POST',
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    async: false,
    data: {
      url: window.location.href
    },
    success: function (data) {
      wxShareSign = JSON.parse(data);
    },
    error: function (data) {
      console.log("error");
    }
  });
  wx.config({
    debug: isDebug, //调式模式，设置为ture后会直接在网页上弹出调试信息，用于排查问题
    appId: wxShareSign.appId,
    timestamp: wxShareSign.timestamp,
    nonceStr: wxShareSign.nonceStr,
    signature: wxShareSign.signature,
    jsApiList: [ //需要使用的网页服务接口
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'showMenuItems',
      'hideMenuItems'
    ]
  });
  wx.ready(function () {
    // 批量隐藏菜单项
    wx.hideMenuItems({
      menuList: ['menuItem:readMode', // 阅读模式
        'menuItem:copyUrl',// 复制链接
        'menuItem:openWithSafari', 'menuItem:share:email',
        'menuItem:openWithQQBrowser', 'menuItem:delete',
        'menuItem:share:qq', 'menuItem:share:weiboApp',
        'menuItem:share:facebook', 'menuItem:share:QZone',
        'menuItem:exposeArticle', 'menuItem:share:appMessage',
        'menuItem:share:timeline', 'menuItem:setFont'],
      success: function (res) {

      },
      fail: function (res) {

      }
    });
    // 批量显示菜单项
    wx.showMenuItems({
      menuList: [
        "menuItem:share:timeline",//分享到朋友圈
        "menuItem:share:appMessage",//分享给好友
        'menuItem:favorite', // 收藏
        'menuItem:profile', // 查看公众号（已添加）
        'menuItem:addContact' // 查看公众号（未添加）
      ],
      success: function (res) {
      },
      fail: function (res) {
      }
    });
  });

  wx.ready(function () { //ready函数用于调用API，如果你的网页在加载后就需要自定义分享和回调功能，需要在此调用分享函数。//如果是微信游戏结束后，需要点击按钮触发得到分值后分享，这里就不需要调用API了，可以在按钮上绑定事件直接调用。因此，微信游戏由于大多需要用户先触发获取分值，此处请不要填写如下所示的分享API
    // 1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareAppMessage({
      title: shareCont.title,
      desc: shareCont.desc,
      link: shareCont.link,
      imgUrl: shareCont.imgUrl,
      success: shareCont.successEvt,
      cancel: shareCont.cancelEvt
    });

    //2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareTimeline({
      title: shareCont.title,
      link: shareCont.link,
      imgUrl: shareCont.imgUrl,
      success: shareCont.successEvt,
      cancel: shareCont.cancelEvt
    });
  });
}
// 保留length位小数，非四舍五入
util.toFixedFloor2 = function (value, length) {
  if (isNaN(value)) {
    console.error(value + ' not a Number');
  } else {
    return parseInt(value * Math.pow(10, length)) / Math.pow(10, length);
  }
}
// 根据url中的app参数做不同的处理
util.osTypeHandle = function (obj) {
  var osTag = this.hrefSplit(window.location.href).app;
  if (osTag === 'IPHONE') {
    obj.iphone();
  } else if (osTag === 'ANDROID') {
    obj.android();
  } else {
    obj.h5();
  }
}
// 字符串超过len位以...代替
util.strOverflow = function (str, len) {
  if (str.length > len) {
    return str.substr(0, len) + '...';
  }else {
    return str;
  }
}
//根据浏览器信息判断客户端返回true为iOS返回false为安卓 other不认识的
util.isOsType = function(){
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(isAndroid){
    return false
  }
  if(isiOS){
    return true
  }
  return 'other'
}








