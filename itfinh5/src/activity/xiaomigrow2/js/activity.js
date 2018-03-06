$(function () {
	//神策==================
	var current_url = location.href;

	//活动规则 01
	$('#btn-rule').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '活动规则',
			elementName: '活动规则'
		});
	})
	//开始抽奖 02
	$('#btn_lucking').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '开始抽奖',
			elementName: '开始抽奖'
		});
	})
	//立即注册 03
	$('#checkPhone').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即抽奖',
			elementName: '验证手机号'
		});
	})
	//点击图形验证码 04
	$('#checkcode_img').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '点击图形验证码',
			elementName: '刷新图形验证码'
		});
	})
	//获取验证码 05
	$('#sms_validCode_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '获取验证码',
			elementName: '获取短信验证码'
		});
	})
	//确认抽奖 06
	$('#register_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '确认抽奖',
			elementName: '注册'
		});
	})
	//退出 07
	$('#outsign').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '退出',
			elementName: '着陆页面退出'
		});
	})
	//进入个人中心 08
	$('#link_account').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '进入个人中心',
			elementName: '个人中心'
		});
	})
	//下载App 09
	$('#download').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '下载App',
			elementName: '下载'
		});
	})
	//立即投资 10
	$('#link_invest_list').bind('click', function () {
		sa.track('element_click', {
			campaignName: '10月小米成长体系2',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即投资',
			elementName: '投资'
		});
	})
	//初始化指定位置
	var PINTH = $('.pint_box').height();
	var PINTW = $('.pint_box').width();
	$('.pint_box').css({
		'transform-origin': PINTW/2+'px '+(PINTW/0.931*0.5684)+'px',
		'-webkit-transform-origin':PINTW/2+'px '+(PINTW/0.931*0.5684)+'px'
	})
	//关闭错误提示
	$('.error_tip').click(function(){
		$(this).hide();
	})
	//清除表单数据事件
	$('.inp_phone,.inp_pictrue_code,.inp_phone_code,.inp_psw').focus(function(){
		$('.clearData').hide();
		$(this).siblings('.clearData').show();
	})
	$('.changeType').click(function(){
		if($(this).hasClass('eye_open')){
			$(this).removeClass('eye_open');
			$('.inp_psw').prop('type','password');
		}else{
			$(this).addClass('eye_open');
			$('.inp_psw').prop('type','text');
		}
	})
})
//vue 实例
var vm = {};
vm.index = function () {
	new Vue({
		el: '#index',
		data: {
			isTwo: false,
			angleNum: 0,
			interval01: '',
			interval02: '',
			pictureUrl: Helper.basePath + 'getvcode.htm',
			isXieYi: false,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			ruleData:'',
			phoneCode: '',
			pictureCode: '',
			rewardName:'',
			checkPhoneYes: false,
			isLogin: false,
			userData: {
				userInfo: {
					mobile: '13000000000'
				}
			}
		},
		created: function () {
			var _slef = this;
			this.userData = this.userInfo();
			//判断是否为活动用户
			if (this.userData.isLogin !== 'N') {
				if (this.userData.activityType !== 'XIAOMIGROUPOCT_2') {
					window.location.href = '/src/index/index.html';
				}
			}
			this.isLogin = this.userData.isLogin === 'N' ? false : true;
			this.animateSlow();
			this.activeStatus();
		},
		methods: {
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
			drawGo: (function () {
				var isAllowGo = true;
				return function () {
					var _self = this;
					if (isAllowGo) {
						var luckResult = this.luckyPost();
						if (luckResult.code === '000') {
							this.animateFast();
							$('.pint_box').css('transform', 'rotate(' + (_self.angleNum + 2880 + (luckResult.prize * 60)) + 'deg)');
							setTimeout(function () {
								util.toast(luckResult.message);
								_self.rewardName = '恭喜您，获得'+ luckResult.message.substring(10);
								isAllowGo = true;
								_self.animateSlow();
							}, 3300);
							_self.angleNum += 3600;
							isAllowGo = false;
						} else {
							util.toast(luckResult.message);
						}
					}
				}
			}()),
			//当前活动状态&获取奖品名字
			activeStatus: function () {
				var _self = this;
				$.ajax({
					url: Helper.basePath + 'activityTurntable/activity.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMIGROUPOCT_2'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.ruleData = data.rule;
					if (data.code !== '000') {
						util.alert(data.message, function () {
							window.location.href = '/src/index/index.html';
						})
					}
				})
				$.ajax({
					url: Helper.basePath + '/activityTurntable/getOctGroupLotteryRewardName.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMIGROUPOCT_2'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.rewardName = data.rewardName;
				})
			},
			luckyPost: function () {
				// var randomNum = ~~(Math.random() * 3); //模拟抽奖数据
				// console.log(randomNum);
				// return {
				// 	code: '000',
				// 	prize: randomNum
				// };
				var luckdata;
				$.ajax({
						url: Helper.basePath + 'activityTurntable/doXiaoMiOctGroupLottery.htm',
						type: 'POST',
						dataType: 'json',
						async: false,
						xhrFields: {
							withCredentials: true
						},
						data: {
							activityTypeStr: 'XIAOMIGROUPOCT_2'
						}
					})
					.done(function (data) {
						luckdata = JSON.parse(data);
					})
					.fail(function () {
						util.toast('网络异常');
						return;
					})
				return luckdata;
			},
			//退出登录
			linkLogot: function () {
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
							window.location.href = '/src/activity/xiaomigrow2/index.html?random=' + parseInt(Math.random() * 100000);
						}
					})
			},
			animateSlow: function () {
				var _self = this;
				clearInterval(this.interval02);
				this.interval01 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
				}, 760);
			},
			phoneRepalceMask: util.phoneRepalceMask, //手机号处理函数
			animateFast: function () {
				var _self = this;
				clearInterval(this.interval01);
				this.interval02 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
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
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			closeRegisBox: function () {
				this.checkPhoneYes = false;
				window.location.href = '/src/activity/xiaomigrow2/index.html?random=' + parseInt(Math.random() * 100000);
				//$('html,body').removeClass('ovfHiden');
			},
			openXieyi: function () {
				$('.xieyi_box').css('left', '0px');
			},
			getPhoneCode: function () {
				var _self = this;
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else if (util.checkPictureCode(this.pictureCode) !== true) {
					util.toast(util.checkPictureCode(this.pictureCode));
				} else {
					if (!this.isPhoneCode) {
						// 发验证码请求
						$.ajax({
								url: Helper.basePath + 'commonActivity/sendValidSms.htm',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
							withCredentials: true
						},
								data: {
									'mobile': this.inpPhone,
									'checkcode': this.pictureCode,
									'isBack': false
								}
							})
							.done(function (data) {
								if (data.code === '0000') {
									_self.isPhoneCode = true;
									_self.countTime = '' + _self.countTimeSpan + 's';
									var saveTimeSpan = _self.countTimeSpan;
									var timeFun = function () {
										_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
										if (_self.countTimeSpan < 0) {
											_self.isPhoneCode = false;
											_self.countTime = '重新获取';
											_self.countTimeSpan = saveTimeSpan;
										} else {
											setTimeout(function () {
												timeFun();
											}, 1000);
										}
									}
									util.toast('验证码已发送');
									timeFun();
								} else {
									_self.refreshPicture();
									if (data.code == '00004') {
										util.toast('操作频繁，稍后再试');
									} else {
										util.toast(data.message);
									}
								}
							})
					}
				}
			},
			regisMain: function () {
				var _self = this;
				if(util.checkPictureCode(_self.pictureCode)!==true){
					util.toast(util.checkPictureCode(_self.pictureCode));
					return ;
				}
				if(util.checkPhoneCode(_self.phoneCode)!==true){
					util.toast(util.checkPhoneCode(_self.phoneCode));
					return ;
				}
				if(util.checkPsw(_self.inpPsw)!==true){
					util.toast(util.checkPsw(_self.inpPsw));
					return ;
				}
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
								'activityType': 'XIAOMIGROUPOCT_2'
							}
						})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/xiaomigrow2/index.html?random=' + parseInt(Math.random() * 100000);
								}, 2000)
							} else {
								util.toast(data.message);
								_self.refreshPicture();
							}
						})
				}
			},
			check_phone: function () {
				if (util.checkPhone(this.inpPhone) !== true) {
					$('.error_tip').show().text(util.checkPhone(this.inpPhone))
				} else {
					$('.reg_two').removeClass('hide');
					this.checkPhoneYes = true;
				}
			},
			//清除表单数据
			clearInpData:function(sel){
				this[sel] = '';
			}
		}
	})
}