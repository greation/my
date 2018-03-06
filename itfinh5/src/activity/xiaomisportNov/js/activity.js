$(function () {
	//神策==================
	var current_url = location.href;

	//活动规则
	$('#btn-rule').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '活动规则',
			elementName: '活动规则'
		});
	})
	//开始抽奖
	$('#btn_lucking').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '开始抽奖',
			elementName: '开始抽奖'
		});
	})
	//立即注册
	$('#checkPhone').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即抽奖',
			elementName: '验证手机号'
		});
	})
	//点击图形验证码
	$('#checkcode_img').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '点击图形验证码',
			elementName: '刷新图形验证码'
		});
	})
	//获取验证码
	$('#sms_validCode_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '获取验证码',
			elementName: '获取短信验证码'
		});
	})
	//确认抽奖
	$('#register_btn_id').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '确认抽奖',
			elementName: '注册'
		});
	})
	//退出
	$('#outsign').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '退出',
			elementName: '着陆页面退出'
		});
	})
	//进入个人中心
	$('#link_account').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '进入个人中心',
			elementName: '个人中心'
		});
	})
	//下载App
	$('#download').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '下载App',
			elementName: '下载'
		});
	})
	//立即投资
	$('#link_invest_list').bind('click', function () {
		sa.track('element_click', {
			campaignName: '11月小米运动',
			lpUrl: current_url,
			elementId: $(this).attr('id'),
			elementContent: '立即投资',
			elementName: '投资'
		});
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
			awardText: ['288元现金券', '爱奇艺VIP会员3个月', '喜马拉雅46喜点', '288现金券'],
			current_url:Helper.webPath + '/src/activity/xiaomigroupOct/index.html',
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
				if (this.userData.activityType !== 'XIAOMISPORTNOV') {
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
			cjreward: function(){
				var _this=this;
				 sa.track('element_click',{campaignName:'11月小米运动',lpUrl:this.current_url,elementId:$("#cjrewardId").attr('id'),elementContent:'立即抽奖',elementName:'立即抽奖'});
				if(!this.isLogin){
    				util.toast('请您注册后抽奖~');
    			}else{
    				
    				var num = 0;
    				var source = util.hrefSplit(window.location.href);
    				$.ajax({
					url: Helper.basePath + 'activityTurntable/doXiaoMiNovLottery.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					data: {
						activityTypeStr: 'XIAOMISPORTNOV'
					},
					xhrFields: {
						withCredentials: true
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					if (data.code === '0001') {
						util.toast('请您注册后抽奖~');
						$('.header_fixed').focus();
					} else if (data.code === '0002') {
						util.toast('该用户不是活动用户~');
					} else if (data.code === '0003') {
						util.toast('您的机会已用完哟~');
					}
					num = 999;
					if (data.code === '000') {
						$(".admask").addClass("maskb");
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
								_this.activeStatus();
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
			//当前活动状态
			activeStatus: function () {
				var _self = this;
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
						activityTypeStr: 'XIAOMISPORTNOV'
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
					url: Helper.basePath + 'activityTurntable/getNovLotteryRewardName.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						activityTypeStr: 'XIAOMISPORTNOV'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.rewardName = data.rewardName;
				})
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
							window.location.href = '/src/activity/xiaomisportNov/index.html?random=' + parseInt(Math.random() * 100000);
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
				window.location.href = '/src/activity/xiaomisportNov/index.html?random=' + parseInt(Math.random() * 100000);
				//$('html,body').removeClass('ovfHiden');
			},
			openXieyi: function () {
				$('.xieyi_box').show();
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
								'activityType': 'XIAOMISPORTNOV'
							}
						})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/xiaomisportNov/index.html?random=' + parseInt(Math.random() * 100000);
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