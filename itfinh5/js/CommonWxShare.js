var timestamp='';
var nonceStr='';
var signature='';
var appId='';


function initWxShare(){
	$.ajax({
	    type: "POST",
	    url: Helper.basePath + "/weixinCore/getjsapiTikcet.htm",
	    dataType: "json",
	    async:false,// 同步
	    timeout: 20000,
	    data: {url:window.location.href},
	    success: function (msg) {
	    	timestamp=msg[0].timestamp;
	    	nonceStr=msg[0].nonceStr;
	    	signature=msg[0].signature;
	    	appId=msg[0].appId;
	    	alert(appId);
	    	initSuccess();
	    }
	});
}

function initSuccess(){
	if(typeof(logoUrls) == "undefined")
	{
		logoUrls = "http://"+location.hostname+"/page/weixin/images/dream.png";
	}
	wx.config({
      debug: false,
      appId: appId,
      timestamp:timestamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'showMenuItems',
        'hideMenuItems'
      ]
	});
	
	wx.ready(function () {
		/**
		 * 分享朋友圈
		 */
		wx.onMenuShareTimeline({
		  title: titleVal,
		  link: link,
	      imgUrl: logoUrls,
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	$("#fenxiang").hide();
				$('#send_cg').show();
				setTimeout("$('#send_cg').hide()",1000);
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	location.href=Helper.basePath +"";
		    }
		});
		/**
		 * 分享给朋友
		 */
		wx.onMenuShareAppMessage({
		      title: titleVal,
		      desc:desc,
		      link: link,
		      imgUrl: logoUrls,
		      success: function (res) {
		    	    WeixinJSBridge.invoke('closeWindow',{},function(res){});
		    		$("#fenxiang").hide();
					$('#send_cg').show();
					setTimeout("$('#send_cg').hide()",1000);
		      },
		      cancel: function (res) {
		    	  location.href=Helper.basePath +"";
		      }
		 });
		    
	    //批量隐藏菜单项
	    wx.hideMenuItems({
		        menuList: [
		          'menuItem:readMode', // 阅读模式
		          'menuItem:copyUrl' ,// 复制链接
		          'menuItem:openWithSafari',
		          'menuItem:share:email',
		          'menuItem:openWithQQBrowser',
		          'menuItem:delete',
		          'menuItem:share:qq',
		          'menuItem:share:weiboApp',
		          'menuItem:share:facebook',
		          'menuItem:share:QZone',
		          'menuItem:exposeArticle',
		          'menuItem:setFont'
		        ],
		        success: function (res) {
		         
		        },
		        fail: function (res) {
		          
		        }
		  });
		 // 批量显示菜单项
		 wx.showMenuItems({
		      menuList: [
		        'menuItem:refresh', 		 //刷新
		        'menuItem:share:appMessage', //分享给朋友
		        'menuItem:share:timeline',   // 分享到朋友圈
		        'menuItem:favorite',         //收藏
		        'menuItem:profile',          //查看公众号（已添加）
		        'menuItem:addContact'		 //查看公众号（未添加）
		      ],
		      success: function (res) {
		      },
		      fail: function (res) {
		      }
		 });
    });
	
	wx.error(function (res) {
		  alert(res.errMsg);
	});
}


//分享朋友圈
function resetMenuShareTimeline(title, link){
	wx.onMenuShareTimeline({
		  title: title,
		  link: link,
	      imgUrl: "http://"+location.hostname+"/page/weixin/images/dream.png",
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	$("#fenxiang").hide();
				$('#send_cg').show();
				setTimeout("$('#send_cg').hide()",1000);
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    	location.href=Helper.basePath +"";
		    }
		});
}

//分享朋友重置
function resetMenuShareAppMessage(title, desc, link){
	wx.onMenuShareAppMessage({
	      title: title,
	      desc:desc,
	      link: link,
	      imgUrl:  "http://"+location.hostname+"/page/weixin/images/dream.png",
	      success: function (res) {
	    	    WeixinJSBridge.invoke('closeWindow',{},function(res){});
	    		$("#fenxiang").hide();
				$('#send_cg').show();
				setTimeout("$('#send_cg').hide()",1000);
	      },
	      cancel: function (res) {
	    	  location.href=Helper.basePath +"";
	      }
	 });
}
