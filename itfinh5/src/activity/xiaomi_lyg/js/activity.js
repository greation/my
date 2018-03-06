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
			awardText: ['288元现金券', '288元现金券', '喜马拉雅46喜点', '2%加息券', '格瓦拉黄券1张']
		},
		created: function () {
			var _slef = this;
			this.userData = this.userInfo();
			//判断是否为活动用户
			if (this.userData.isLogin !== 'N') {
				if (this.userData.activityType !== 'XIAOMI_ZERO_BUY') {
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
						var sNum = this.luckyPost();
						if (sNum !== 999) {
							this.animateFast();
							$('.plate').css('transform', 'rotate(' + (this.angleNum + 2880 + (360 - sNum * 72)) + 'deg)');
							setTimeout(function () {
								util.toast('恭喜你抽中</br>' + _self.awardText[sNum]);
								isAllowGo = true;
								_self.animateSlow();
							}, 3300);
							_self.angleNum += 3600;
							isAllowGo = false;
						}
					}
				}
			}()),
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
						activityTypeStr: 'XIAOMI_ZERO_BUY'
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
			luckyPost: function () {
				// var randomNum = ~~(Math.random() * 5); //模拟抽奖数据
				// console.log(randomNum);
				// return randomNum;
				var source = util.hrefSplit(window.location.href);
				var num = 0;
				$.ajax({
					url: Helper.basePath + 'activityTurntable/ltZeroBuy.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					console.log(data);
					if (data.code === '0001') {
						util.toast('请您注册后抽奖~');
						$('.inp_phone01').focus();
					} else if (data.code === '0002') {
						util.toast('该用户不是活动用户~');
					} else if (data.code === '0003') {
						util.toast('你的机会已用完哟~');
					}
					num = 999;
					if (data.code === '000') {
						num = data.prize;
					}
				})
					.fail(function () {
						num = 999;
						util.toast('网络异常');
					})
				return num;
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
							window.location.href = '/src/activity/xiaomi_lyg/index.html?random=' + parseInt(Math.random()*100000);
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
			phoneRepalceMask: util.phoneRepalceMask,//手机号处理函数
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
                window.location.href = '/src/activity/xiaomi_lyg/index.html?random=' + parseInt(Math.random()*100000);
				//$('html,body').removeClass('ovfHiden');
			},
			openXieyi:function(){
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
							url: Helper.basePath + 'sendSmsByType.htm',
							type: 'POST',
							dataType: 'json',
							data: { 'username': this.inpPhone, 'smsType': 'REGISTER' }
						})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
									_self.isPhoneCode = true;
									_self.countTime = '' + _self.countTimeSpan + 's';
									var saveTimeSpan = _self.countTimeSpan;
									var timeFun = function () {
										_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
										if (_self.countTimeSpan < 0) {
											_self.isPhoneCode = false; _self.countTime = '重新获取'; _self.countTimeSpan = saveTimeSpan;
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
				var _self = this;
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
							'activityType': 'XIAOMI_ZERO_BUY'
						}
					})
						.done(function (data) {
							if (data.isSuccess) {
								util.toast('可以开始抽奖啦~');
								setTimeout(function () {
									window.location.href = '/src/activity/xiaomi_lyg/index.html?random=' + parseInt(Math.random()*100000);
								}, 2000)
							} else {
								util.toast(data.message);
								_self.refreshPicture();
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
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else {
					$('.reg_two').removeClass('hide');
					this.checkPhoneYes = true;
				}
			}
		}
	})
}