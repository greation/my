var vm = {};
vm.index = function () {
	new Vue({
		el: '#index',
		data: {
			angleNum: 0,
			isTwo: false,
			interval01: '',
			interval02: '',
			pictureUrl: Helper.basePath + 'getvcode.htm',
			isXieYi: false,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			phoneCode: '',
			pictureCode: '',
			checkPhoneYes: false,
			isLogin: false,
			userData: '',
			click :false,
			awardText: ['288元现金券', '爱奇艺VIP会员3个月', '喜马拉雅46喜点', '288现金券'],
			current_url:Helper.webPath + '/src/activity/xiaomigroupOct/index.html'
		},
		created: function () {
			var _this = this;
			
			this.userData = this.userInfo();
			//判断是否为活动用户
			if (this.userData.isLogin !== 'N') {
				if (this.userData.activityType !== 'XIAOMIGROUPOCT_1') {
					window.location.href = '/src/index/index.html';
				}
			}
			this.isLogin = this.userData.isLogin === 'N' ? false : true;
			this.animateSlow();
			 this.activeStatus();
			 this.justlogin();
		},
		methods: {
			justlogin:function(){
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
			},
			cjreward: function(){
				var _this=this;
				 sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:this.current_url,elementId:$("#cjrewardId").attr('id'),elementContent:'立即抽奖',elementName:'立即抽奖'});
				if(!this.isLogin){
    				util.toast('请您注册后抽奖~');
    			}else{
    				
    				var num = 0;
    				var source = util.hrefSplit(window.location.href);
    				$.ajax({
					url: Helper.basePath + 'activityTurntable/ltXiaomiOct.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					if (data.code === '0001') {
						util.toast('请您注册后抽奖~');
						$('.inp_phone01').focus();
					} else if (data.code === '0002') {
						util.toast('该用户不是活动用户~');
					} else if (data.code === '0003') {
						util.toast('您的机会已用完哟~');
					}
					num = 999;
					if (data.code === '000') {
						$(".admask").addClass("mask");
						num = data.prize;
						lottery.prizeData=parseInt(data.prize);
						if (this.click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
			            	return false;
				        } else {
				            lottery.speed = 100;
				            roll(); //转圈过程不响应click事件，会将click置为false
				            this.click = true; //一次抽奖完成后，设置click为true，可继续抽奖
				            setTimeout(function () {
								util.toast('恭喜你抽中</br>' + _this.awardText[num]);	
							}, 5000);
				            return false;
				        }

					}
				})
					.fail(function () {
						num = 999;
						util.toast('网络异常');
					})
    			}

			},
			userInfo: function () {
				var userJson;
				$.ajax({
					url: Helper.basePath + 'member/getUser.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function (data) {
					userJson = JSON.parse(data);
				})
				return userJson
			},
			
			//当前活动状态
			activeStatus: function () {
				var num = 0;
				$.ajax({
					url: Helper.basePath + 'activityTurntable/activity.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMIGROUPOCT_1'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					if (data.code !== '000') {
						util.alert(data.message, function () {
							window.location.href = '/src/index/index.html';
						})
					}
				})
			},
			
			//退出登录
			linkLogot: function () {
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#linkLogot").attr('id'),elementContent:'退出',elementName:'着陆页面退出'});
				$.ajax({
					url: Helper.basePath + 'logout.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {}
				})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							window.location.href = '/src/activity/xiaomigroupOct/index.html?random=' + parseInt(Math.random()*100000);
						}
					})
			},
			animateSlow: function () {
				var _this = this;
				clearInterval(this.interval02);
				this.interval01 = setInterval(function () {
					_this.isTwo = !_this.isTwo;
				}, 760);
			},
			phoneRepalceMask: util.phoneRepalceMask,//手机号处理函数
			animateFast: function () {
				var _this = this;
				clearInterval(this.interval01);
				this.interval02 = setInterval(function () {
					_this.isTwo = !_this.isTwo;
				}, 60);
			},
			isWxBorrow: function () {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			},
			refreshPicture: function () {
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#pictureId").attr('id'),elementContent:'点击图形验证码',elementName:'刷新图形验证码'});
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			closeRegisBox: function () {
				this.checkPhoneYes = false;
                window.location.href = '/src/activity/xiaomigroupOct/index.html?random=' + parseInt(Math.random()*100000);
				//$('html,body').removeClass('ovfHiden');
			},
			openXieyi:function(){
				$('#xieyi_toast_cont').show();
			},
			activityBack:function(){
				$('#xieyi_toast_cont').hide();
			},
			getPhoneCode: function () {
				var _this = this;
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#phonecodeId").attr('id'),elementContent:'获取验证码',elementName:'获取短信验证码'});
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
				} else {
					if (!this.isPhoneCode) {
						// 发验证码请求
						$.ajax({
							url: Helper.basePath + 'sendSmsByType.htm',
							type: 'POST',
							dataType: 'json',
							data: { 'username': this.inpPhone, 'smsType': 'REGISTER' }
						})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
									_this.isPhoneCode = true;
									_this.countTime = '' + _this.countTimeSpan + 's';
									var saveTimeSpan = _this.countTimeSpan;
									var timeFun = function () {
										_this.countTime = '' + (_this.countTimeSpan--) + 's后获取';
										if (_this.countTimeSpan < 0) {
											_this.isPhoneCode = false; _this.countTime = '重新获取'; _this.countTimeSpan = saveTimeSpan;
										} else {
											setTimeout(function () {
												timeFun();
											}, 1000);
										}
									}
									util.toast('验证码已发送');
									timeFun();
								} else if (data.code === '1001') {
									util.toast('手机号码格式不正确');
								} else if (data.code === '1002') {
									util.toast('该手机号已注册');
								} else if (data.code === '2003') {
									util.toast('短信发送超过10次');
								} else if (data.code === '2001') {
									util.toast('请求频繁，'+data.time+'秒后重试');
								}
							})
					}
				}
			},
			regisMain: function () {
				var _this = this;
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#rigiserId").attr('id'),elementContent:'确认抽奖',elementName:'注册'});
				if (!this.isXieYi) {
					util.toast('请阅读并同意注册协议');
				} else {
					$.ajax({
						url: Helper.basePath + 'commonActivity/register.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							'mobile': this.inpPhone,
							'password': this.inpPsw,
							'mobilecode': this.phoneCode,
							'checkcode': this.pictureCode,
							'registerSource': 'HTML5',
							'token_id': tokenId,
							'activityType': 'XIAOMIGROUPOCT_1'
						}
					})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/xiaomigroupOct/index.html?random=' + parseInt(Math.random()*100000);
								}, 2000)
							} else {
								util.toast(data.message);
								_this.refreshPicture();
							}
							// if (data.code === '000') {
							// 	util.toast('可以开始抽奖啦~');
							// 	setTimeout(function(){
							// 		window.location.reload();
							// 	},2000)
							// 	//util.baseLink(Helper.webPath + 'src/base/real_name.html', 2000);
							// } else if (data.code === '1001') {
							// 	util.toast('手机号码格式不正确');
							// } else if (data.code === '6018') {
							// 	util.toast('短信验证码错误');
							// } else if (data.code === '6011') {
							// 	util.toast('短信验证码已过期');
							// } else if (data.code === '1002') {
							// 	util.toast('该手机号已注册');
							// } else if (data.code === '2001') {
							// 	util.toast('密码格式不正确');
							// } else if (data.code === '3001') {
							// 	util.toast('邀请码不存在');
							// } else if (data.code === '4001') {
							// 	util.toast('手机验证码不能为空');
							// } else if (data.code === '9999') {
							// 	util.toast('系统异常');
							// } else if (data.code === '7008') {
							// 	util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
							// }
						})
				}
			},
			check_phone: function () {
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#check_phoneId").attr('id'),elementContent:'验证手机号',elementName:'验证手机号'});
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else {
					$('.reg_two').removeClass('hide');
					this.checkPhoneYes = true;
				}
			},
			joinCenter:function(){
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#joinCenter").attr('id'),elementContent:'进入个人中心',elementName:'个人中心'});
				window.location.href ='/src/account/index.html';
			},
			downloadApp:function(){
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#download_app").attr('id'),elementContent:'下载App',elementName:'下载'});
				window.location.href ='http://m.ekeyfund.com/Website/download-app.jsp';
			},
			investId:function(){
				sa.track('element_click',{campaignName:'十月小米成长体系',lpUrl:current_url,elementId:$("#investId").attr('id'),elementContent:'立即投资',elementName:'投资'});
				window.location.href ='/src/invest/list.html';
			}
		}
	})
}