(function(para) {
  var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
  var ifs = ['track','quick','register','registerPage','registerOnce','clearAllRegister','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    y.parentNode.insertBefore(x, y);
    w[n].para = para;
  }
})({
  sdk_url: 'https://static.sensorsdata.cn/sdk/1.8.9/sensorsdata.min.js',
  name: 'sa',
  web_url: 'https://data.ekeyfund.com:4007//?project='+Helper.settingPath,
  server_url: 'https://data.ekeyfund.com:4006/sa?project='+Helper.settingPath,
  heatmap:{},
  show_log:false,
  use_app_track: true,
  use_client_time: true
});
$.ajax({
  url: Helper.basePath + 'member/getUser.htm',
  type: 'POST',
  dataType: 'json',
  xhrFields: {
    withCredentials: true
  }
})
.done(function(data) {
  var data = JSON.parse(data);
  if (data.isLogin === 'N') {
    sa.register({
      isLogin:false,
      platformType:'H5'
    })
  }else{
    sa.register({
      isLogin:true,
      platformType:'H5'
    })
  }
})
.fail(function() {util.toast('未知错误')});
sa.quick('autoTrack');
var SaFun={};
SaFun.banner = function(title,posi){
  sa.track('banner_click',{
    title:document.title,
    banner_id:'',
    position:posi,
    banner_name:''
  })
}