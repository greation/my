var vms={}
//分享注册
vms.shareRegister=function(){
	var re_vm = new Vue({
  el: '#re',
  data: {
  	inPsActive:[false,false,false,false],
  	isOpenEye:true,
  	isXieYi:false,
  	isPhoneCode:false,
  	countTime:'获取验证码',
  	countTimeSpan:90,
  	inpPhone:'',
  	inpPsw:'',
  	phoneCode:'',
  	pictureCode:'',
  	inviteCode:util.hrefSplit(window.location.href).un,
  	pictureUrl:Helper.basePath+'getvcode.htm',
  	showClearPsw:false,
  	showClearPhone:false,
  	showphoneCode:false,
  	showpictureCode:false,
  	errorphone:false,
  	errorpictureCode:false,
  	errorphoneCode:false,
  	errorinpPsw:false
  },
  mounted:function(){
  	$("imgcode").vel(this.pictureCode);
  },
  created:function(){
  	//this.getPicture();
  	this.refreshValidCode('imgcode');
  },
  methods:{
  	inpFocus:function(num){
  		this.inPsActive=[false,false,false,false];
  		this.inPsActive[num] = true;
  		this.showClearPhone = false;
  		this.showClearPsw = false;
  		this.showphoneCode = false;
  		this.showpictureCode = false;
  		if(num===0){
  			this.showClearPhone = true;
  		}else if(num===1){
			this.showClearPsw = true;
  		}
  		else if(num===2){
			this.showpictureCode = true;
  		}
  		else if(num===3){
			this.showphoneCode = true;
  		}
  	},
  	clearText:function(num){
  		if(num===0){
  			this.inpPhone = '';
  			this.showClearPhone = false;
  		}else if(num===1){
  			this.inpPsw = '';
  			this.showClearPsw = false;
  		}
  		else if(num===2){
  			this.pictureCode = '';
  			this.showpictureCode = false;
  		}
  		else if(num===3){
  			this.phoneCode = '';
  			this.showphoneCode = false;
  		}
  	},
  	hideError:function(num){
  		if(num===0){
  			this.inpPhone = '';
  			this.errorphone = false;
  		}
  		if(num===1){
  			this.errorpictureCode = '';
  			this.errorpictureCode = false;
  		}
  		if(num===2){
  			this.errorphoneCode = '';
  			this.errorphoneCode = false;
  		}
  		if(num===3){
  			this.errorinpPsw = '';
  			this.errorinpPsw = false;
  		}
  	},
  	eyePsw:function(){
  		this.isOpenEye = !this.isOpenEye;
  	},
  	refreshPicture:function(){
  		this.pictureUrl = Helper.basePath+'getvcode.htm?h='+Math.random();
  	},
  	getPhoneCode:function(){
  		var _self=this;
  		if(util.checkPhone(this.inpPhone)!==true){
  			util.toast(util.checkPhone(this.inpPhone));
  		}else if(util.checkPictureCode(this.pictureCode)!==true){
  			_self.errorpictureCode ='';
	  		_self.errorpictureCode = true;
//			util.toast(util.checkPictureCode(this.pictureCode));
  		}else{
  			if(!this.isPhoneCode){
	  			
	  			// 发验证码请求
	  			$.ajax({
		  			url: Helper.basePath+'sendSmsByType.htm',
		  			type: 'POST',
		  			dataType: 'json',
		  			data: {'username':this.inpPhone,'smsType':'REGISTER','checkcode':this.pictureCode,'flag':1}
		  		})
		  		.done(function(data) {
		  			var data=JSON.parse(data);
		  			if(data.code==='000'){
	  					util.toast('验证码已发送');
	  					_self.isPhoneCode=true;
	  			_self.countTime=''+_self.countTimeSpan+'s';
	  			var saveTimeSpan = _self.countTimeSpan;
		  		var timeFun=function(){
		  			_self.countTime = ''+(_self.countTimeSpan--)+'s后获取';  		
		  			if(_self.countTimeSpan<0) {
		  				_self.isPhoneCode=!_self.isPhoneCode;_self.countTime = '重新获取';_self.countTimeSpan = saveTimeSpan;
			  		}else{
			  			setTimeout(function(){
				  			timeFun();
				  		}, 1000);
			  		}}
		  		timeFun();
		  			}else if(data.code==='1001'){
		  				util.toast('手机号码格式不正确');
		  			}else if(data.code==='1004'){
		  				util.toast('图形验证码不能为空');
		  				_self.isPhoneCode=false;
		  					_self.countTime='获取验证码';
		  					return;
		  			}else if(data.code==='1005'){
		  				util.toast('图形验证码已过期');
		  				_self.refreshValidCode('imgcode');
		  				_self.isPhoneCode=false;
		  					_self.countTime='获取验证码';
		  					return;
		  			}else if(data.code==='1006'){
		  				util.toast('图形验证码错误');
		  				_self.refreshValidCode('imgcode');
		  				_self.isPhoneCode=false;
		  					_self.countTime='获取验证码';
		  					return;
		  			}else if(data.code==='1002'){
		  				util.toast('该手机号已注册');
		  					_self.isPhoneCode=false;
		  					_self.countTime='获取验证码';
		  					return;
		  				
		  			}else if(data.code==='2001'){
		  				util.toast('验证码获取频繁'+data.time+'s后再试');
		  			}
		  		})
	  		}
  		}
  	},
  	regisMain:function(){
  		var _this=this;
  		var nowurl = window.location.href;
			nowurl=encodeURI(nowurl);
  		var pid=util.getRequest(nowurl,"pid");
  		var userid=util.getRequest(nowurl,"userid");
  		if(this.inpPhone==''){
  			util.toast('请输入手机号码');
  		}
  		if(this.pictureCode==''){
  			util.toast('请输入图片验证码');
  		} 
  		if(this.phoneCode==''){
  			util.toast('请输入手机验证码');
  		} 
  		if(this.inpPsw==''){
  			util.toast('请输入密码');
  		} 
  		if(!this.isXieYi){
  			util.toast('请阅读并同意注册协议');
  		}else if(util.checkPsw(this.inpPsw)!=true){
  			_this.errorinpPsw ='';
	  		_this.errorinpPsw = true;
	  		return;
  		}else{
  			$.ajax({
	  			url: Helper.basePath+'register.htm',
	  			type: 'POST',
	  			dataType: 'json',
	  			xhrFields: {
						withCredentials: true
					},
	  			data: {
	  				'username':this.inpPhone,
	  				'password':this.inpPsw,
	  				'recommendCode':this.inviteCode,
	  				'mobilecode':this.phoneCode,
	  				'registerSource':'HTML5',
	  				'checkcode':this.pictureCode,
	  				'pid':pid,
	  				'userid':userid
	  			}
	  		})
	  		.done(function(data) {
	  			var data=JSON.parse(data);
	  			
//	  			if(util.checkTelePhone(_this.inpPhone)!=true){
//					_this.errorphone = true;
//	  			}
//	  			if(util.checkMcode(_this.pictureCode)!=true){
//					_this.errorpictureCode = true;
//				}
//	  			if(util.checkMcode(_this.phoneCode)!=true){
//					_this.errorphoneCode = true;
//				}
//	  			if(util.checkPassword(_this.phoneCode)!=true){
//					_this.errorinpPsw = true;
//				}
	  			if(data.code==='000'){
	  				util.toast('注册成功');
	          		util.baseLink(Helper.webPath+'src/index/index.html',1000);
	  			}else if(data.code==='4001'){
	  				util.toast('手机验证码不能为空');
	  			}else if(data.code==='1002'){
	  				util.toast('该手机号已注册');
	  			}else if(data.code==='1001'){
	  				_this.inpPhone ='';
	  				_this.errorphone = true;
//	  				util.toast('手机号码格式不正确');
	  			}else if(data.code==='1003'){
	  				util.toast('图形验证码不能为空');
	  			}
	  			else if(data.code==='1004'){
	  				util.toast('图形验证码已过期');
	  				refreshValidCode(imgcode);
	  			}
	  			else if(data.code==='1005'){
	  				util.toast('图形验证码错误');
	  			}else if(data.code==='6018'){
	  				_this.refreshValidCode('imgcode');
	  				_this.errorphoneCode ='';
	  				_this.errorphoneCode = true;
//	  				util.toast('短信验证码错误');
	  			}else if(data.code==='6011'){
	  				util.toast('短信验证码已过期');
	  				
	  			}else if(data.code==='2001'){
	  				_this.errorinpPsw ='';
	  				_this.errorinpPsw = true;
//	  				util.toast('密码格式不正确');
	  			}else if(data.code==='9999'){
	  				util.toast('系统异常');
	  			}else if(data.code==='3001'){
	  				util.toast('邀请码不存在');
	  			}
	  		})
  		}
  	},
  	rightget:function(){
  		$('body').scrollTop(0);
  		util.toast('请注册后领取');
  	},
  	refreshValidCode: function(id){
	    var newUrl = "";
	    var oldUrl = $("#" + id).attr("src");
	    if (oldUrl.indexOf("?") != -1) {
	        newUrl = oldUrl.substring(0, oldUrl.indexOf("?")) + "?refresh="
	            + Math.random() * 100;
	    } else {
	        newUrl = oldUrl + "?refresh=" + Math.random() * 100;
	    }
	    $("img[id$=" + id + "]").attr("src", newUrl);
	},
	createBg:function(){
        $('body').append('<div id="modal-bg" style="position:fixed;width:100%;height:100%;left:0;top:0;background:#000;opacity:0.6;z-index:2"></div>');
    },
     showGz:function() {
     	var _this=this;
        this.createBg();
        $('.modal-rule').show();
    },
    hideGz:function(){
        $('.modal-rule').hide();
        $('#modal-bg').remove();
    }



  }
})
}


		/**
 * 统计代码
 * @param code 百度给的code
 */
	function coutData(code){
		var _hmt = _hmt || [];
		(function() {
			var hm = document.createElement("script");
			hm.src = "https://hm.baidu.com/hm.js?"+code;
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		})();
	}





