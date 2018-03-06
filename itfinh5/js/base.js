var vms = {}
/*注册*/
vms.regis = function () {
	var re_vm = new Vue({
		el: '#re',
		data: {
			isStep: true,
			inPsActive: [false, false, false, false],
			isOpenEye: true,
			isXieYi: true,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			phoneCode: '',
			inviteCode: '',
			bannerList: ''
		},
		created: function () {
			var _self = this;
			$.ajax({
				url: Helper.basePath + 'article/getBanner.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				data: {
					articleTypeCode: 'NATLPM'
				}
			})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.bannerList = data.bannerList;
				})
				.fail(function () {
				})
		},
		methods: {
			regisNext: function () {
				var _self = this;
				var phoneState = util.checkPhone(this.inpPhone);
				var pswState = util.checkPsw(this.inpPsw);
				var stateArr = [];
				if (phoneState === true && pswState === true && this.isXieYi) {
					$.ajax({
						url: Helper.basePath + 'checkRegistParam.htm',
						type: 'POST',
						dataType: 'json',
						data: { 'username': this.inpPhone, 'password': this.inpPsw }
					})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								_self.isStep = !_self.isStep;
								$('.two').removeClass('hide');
								_self.getPhoneCode();
							} else if (data.code === '1002') {
								util.toast('该手机号码已注册，请立即登录');
							} else if (data.code === '1001') {
								util.toast('请输入正确的手机号');
							} else if (data.code === '2001') {
								util.toast('密码格式不正确');
							}
						})
				} else {
					if (phoneState !== true) {
						stateArr.push(phoneState);
					}
					if (pswState !== true) {
						stateArr.push(pswState);
					}
					if (!this.isXieYi) {
						stateArr.push('请阅读并同意注册协议');
					}
					util.toast(stateArr[0]);
					stateArr = [];
				}
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false];
				this.inPsActive[num] = true;
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			getPhoneCode: function () {
				var _self = this;
				if (!this.isPhoneCode) {
					this.isPhoneCode = !this.isPhoneCode;
					this.countTime = '' + this.countTimeSpan + 's';
					var saveTimeSpan = this.countTimeSpan;
					var timeFun = function () {
						_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
						if (_self.countTimeSpan < 0) {
							_self.isPhoneCode = !_self.isPhoneCode; _self.countTime = '重新获取'; _self.countTimeSpan = saveTimeSpan;
						} else {
							setTimeout(function () {
								timeFun();
							}, 1000);
						}
					}
					timeFun()
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
								util.toast('验证码已发送');
							} else if (data.code === '1001') {
								util.toast('手机号码格式不正确');
							} else if (data.code === '1002') {
								util.toast('该手机号已注册');
							} else if (data.code === '2001') {
								util.toast('请求频繁，'+data.time+'秒后重试');
							} else if (data.code === '2002') {
								util.toast('当天短信发送超过10次');
							} else if (data.code === '999') {
								util.toast('未知错误，请联系客服');
							} else if (data.code === '2003') {
								util.toast('发送失败');
							}
						})
				} else {

				}
			},
			regisMain: function () {
				$.ajax({
					url: Helper.basePath + 'register.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						'username': this.inpPhone,
						'password': this.inpPsw,
						'recommendCode': this.inviteCode,
						'mobilecode': this.phoneCode,
						'registerSource': 'HTML5',
						'token_id': tokenId
					}
				})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							util.toast('注册成功');
							// 神策
							$.ajax({
								url: Helper.basePath + 'member/getUser.htm',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
									withCredentials: true
								}
							})
								.done(function (data) {
									var data = JSON.parse(data);
									if (data.isLogin !== 'N') {
										sa.login(data.userInfo.id);
										util.baseLink(Helper.webPath + 'src/base/real_name.html', 2000);
									}
								})
								.fail(function () { })
						} else if (data.code === '1001') {
							util.toast('手机号码格式不正确');
						} else if (data.code === '6018') {
							util.toast('短信验证码错误');
						} else if (data.code === '6011') {
							util.toast('短信验证码已过期');
						} else if (data.code === '1002') {
							util.toast('该手机号已注册');
						} else if (data.code === '2001') {
							util.toast('密码格式不正确');
						} else if (data.code === '3001') {
							util.toast('邀请码不存在');
						} else if (data.code === '4001') {
							util.toast('手机验证码不能为空');
						} else if (data.code === '5001') {
							util.toast('您的网络ip地址存在异常，请更换ip后重试或致电客服咨询。');
						} else if (data.code === '9999') {
							util.toast('系统异常');
						} else if (data.code === '7008') {
							util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
						}

					})
			}
		}
	})
}
//分享注册
vms.shareRegister = function () {
	var re_vm = new Vue({
		el: '#re',
		data: {
			inPsActive: [false, false, false, false],
			isOpenEye: true,
			isXieYi: false,
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw: '',
			phoneCode: '',
			pictureCode: '',
			inviteCode: util.hrefSplit(window.location.href).un,
			pictureUrl: Helper.basePath + 'getvcode.htm'
		},
		created: function () {
			//this.getPicture();
		},
		methods: {
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false];
				this.inPsActive[num] = true;
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			refreshPicture: function () {
				this.pictureUrl = Helper.basePath + 'getvcode.htm?h=' + Math.random();
			},
			getPhoneCode: function () {
				var _self = this;
				if (util.checkPhone(this.inpPhone) !== true) {
					util.toast(util.checkPhone(this.inpPhone));
				} else if (util.checkPsw(this.inpPsw) !== true) {
					util.toast(util.checkPsw(this.inpPsw));
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
								} else if (data.code === '2001') {
									util.toast('请求频繁，'+data.time+'秒后重试');
								} else if (data.code === '2002') {
									util.toast('当天短信发送超过10次');
								} else if (data.code === '999') {
									util.toast('未知错误，请联系客服');
								} else if (data.code === '2003') {
									util.toast('发送失败');
								}
							})
					}
				}
			},
			regisMain: function () {
				if (!this.isXieYi) {
					util.toast('请阅读并同意注册协议');
				} else {
					$.ajax({
						url: Helper.basePath + 'register.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							'username': this.inpPhone,
							'password': this.inpPsw,
							'recommendCode': this.inviteCode,
							'mobilecode': this.phoneCode,
							'registerSource': 'HTML5',
							'token_id': tokenId
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('注册成功');
								util.baseLink(Helper.webPath + 'src/base/real_name.html', 2000);
							} else if (data.code === '1001') {
								util.toast('手机号码格式不正确');
							} else if (data.code === '6018') {
								util.toast('短信验证码错误');
							} else if (data.code === '6011') {
								util.toast('短信验证码已过期');
							} else if (data.code === '1002') {
								util.toast('该手机号已注册');
							} else if (data.code === '2001') {
								util.toast('密码格式不正确');
							} else if (data.code === '3001') {
								util.toast('邀请码不存在');
							} else if (data.code === '4001') {
								util.toast('手机验证码不能为空');
							} else if (data.code === '9999') {
								util.toast('系统异常');
							} else if (data.code === '7008') {
								util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
							}
						})
				}
			}
		}
	})
}
//登录逻辑
vms.login = function () {
	var lo_vm = new Vue({
		el: '#lo',
		data: {
			inpPhone: '',
			inpPsw: '',
			inPsActive: [false, false],
			isOpenEye: true,
			showClearPsw: false,
			showClearPhone: false
		},
		created: function () {

		},
		methods: {
			loginMain: function () {
				var _self = this;
				var phoneState = util.checkPhone(this.inpPhone);
				var pswState = util.checkPsw(this.inpPsw);
				var stateArr = [];
				if (phoneState !== true) {
					stateArr.push(phoneState);
				}
				if (pswState !== true) {
					stateArr.push(pswState);
				}
				if (phoneState === true && pswState === true) {
					$.ajax({
						url: Helper.basePath + 'login.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: { withCredentials: true },
						data: { 'username': this.inpPhone, 'password': this.inpPsw, 'token_id': tokenId }
					})
						.done(function (data) {
							var data = JSON.parse(data);
							console.log(data);
							if (data.code === '000') {
								util.toast('登录成功');
								$.ajax({
									url: Helper.basePath + 'member/getUser.htm',
									type: 'POST',
									dataType: 'json',
									xhrFields: {
										withCredentials: true
									}
								})
									.done(function (data) {
										var data = JSON.parse(data);
										if (data.isLogin !== 'N') {
											sa.login(data.userInfo.id);
											util.loginLink(1000, data.account.userId, data.account.userName);
										}
									})
									.fail(function () { })
							} else if (data.code === '6008') {
								util.toast('密码错误');
							} else if (data.code === '2001') {
								util.toast('密码不能为空');
							} else if (data.code === '2002') {
								util.toast('密码格式不正确');
							} else if (data.code === '1002') {
								util.toast('手机号不存在');
							} else if (data.code === '1001') {
								util.toast('手机号码格式错误');
							} else if (data.code === '6001') {
								util.toast('您的手机号还未注册！');
							} else if (data.code === '999') {
								util.toast('系统异常');
							} else if (data.code === '7008') {
								util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服');
							}
						})
				} else {
					util.toast(stateArr[0]);
					stateArr = [];
				}
			},
			inpFocus: function (num) {
				this.inPsActive = [false, false];
				this.inPsActive[num] = true;
				this.showClearPhone = false;
				this.showClearPsw = false;
				if (num === 0) {
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}
			},
			clearText: function (num) {
				if (num === 0) {
					this.inpPhone = '';
					this.showClearPhone = false;
				} else if (num === 1) {
					this.inpPsw = '';
					this.showClearPsw = false;
				}
			},
			eyePsw: function () {
				this.isOpenEye = !this.isOpenEye;
			},
			keyUpInp: function (num) {
				if (num === 0) {
					if (this.inpPhone.length > 0) {
						this.showClearPhone = true;
					} else {
						this.showClearPhone = false;
					}
				} else if (num === 1) {
					if (this.inpPsw.length > 0) {
						this.showClearPsw = true;
					} else {
						this.showClearPsw = false;
					}
				}

			}
		}
	})
}
vms.findPsw = function () {
	new Vue({
		el: '#fp',
		data: {
			isStep: true,
			inPsActive: [false, false, false, false],
			isPhoneCode: false,
			countTime: '获取验证码',
			countTimeSpan: 90,
			inpPhone: '',
			inpPsw01: '',
			inpPsw02: '',
			phoneCode: ''
		},
		methods: {
			inpFocus: function (num) {
				this.inPsActive = [false, false, false, false];
				this.inPsActive[num] = true;
			},
			getPhoneCode: function () {
				var _self = this;
				if(util.checkPhone(this.inpPhone)!==true){
					util.toast(util.checkPhone(this.inpPhone));
					return ;
				}
				if (!this.isPhoneCode) {
					$.ajax({
						url: Helper.basePath + 'sendSmsByType.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: { withCredentials: true },
						data: { 'username': this.inpPhone, 'smsType': 'FOUNDLOGINPWD' }
					})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('验证码已发送');
								_self.isPhoneCode = !_self.isPhoneCode;
								_self.countTime = '' + _self.countTimeSpan + 's';
								var saveTimeSpan = _self.countTimeSpan;
								var timeFun = function () {
									_self.countTime = '' + (_self.countTimeSpan--) + 's后获取';
									if (_self.countTimeSpan < 0) {
										_self.isPhoneCode = !_self.isPhoneCode; _self.countTime = '重新获取'; _self.countTimeSpan = saveTimeSpan;
									} else {
										setTimeout(function () {
											timeFun();
										}, 1000);
									}
								}
								timeFun();
							} else if (data.code === '1003') {
								util.toast('用户未注册');
							} else if (data.code === '1001') {
								util.toast('用户名不合法');
							} else if (data.code === '2003') {
								util.toast('发送失败');
							} else if (data.code === '2001') {
								util.toast('请求频繁，'+data.time+'秒后重试');
							} else if (data.code === '2002') {
								util.toast('当天短信发送超过10次');
							} else if (data.code === '999') {
								util.toast('未知错误，请联系客服');
							} 
						})
				} else {

				}
			},
			nextStep: function () {
				var _self = this;
				$.ajax({
					url: Helper.basePath + 'checkMobileCode.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: { withCredentials: true },
					data: { 'mobile': this.inpPhone, 'mobileCode': this.phoneCode }
				})
					.done(function (data) {
						var data = JSON.parse(data);
						if (data.code === '000') {
							_self.isStep = !_self.isStep;
						} else {
							util.toast('验证码有误');
						}
					})
			},
			findPswMain: function () {
				if (this.inpPsw01 !== this.inpPsw02) {
					util.toast('两次密码输入不一致');
				} else {
					$.ajax({
						url: Helper.basePath + 'getBackPassword.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: { withCredentials: true },
						data: { 'mobile': this.inpPhone, 'mobileCode': this.phoneCode, password: this.inpPsw01 }
					})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000') {
								util.toast('密码修改成功,正在跳转登录');
								setTimeout(function () {
									window.location.href = "/src/base/login.html";
								}, 1000);
							} else {
								util.toast('密码修改失败');
							}
						})
				}
			}
		}
	})
}

vms.realName = function () {
	new Vue({
		el: '#rn',
		data: {
			inpName: '',
			inpId: '',
			data: '',
			bannerList: ''
		},
		created: function () {
			var _self = this;
			$.ajax({
				url: Helper.basePath + 'article/getBanner.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				data: {
					articleTypeCode: 'ESLUYB'
				}
			})
				.done(function (data) {
					var data = JSON.parse(data);
					_self.data = data;
					if (data.isLogin === 'N') {
						window.location.href = Helper.webPath + 'src/base/login.html';
					} else {
						_self.bannerList = data.bannerList;
					}
				})
				.fail(function () {
				})
		},
		methods: {
			realNameMain: function () {
				var _self = this;
				if (util.isEmpty(this.inpName) || util.isEmpty(this.inpId)) {
					util.toast('请填写完整信息');
				} else {
					$.ajax({
						url: Helper.basePath + 'member/sinaOpenRequest.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: { 'realName': this.inpName, 'cardNumber': this.inpId }
					})
						.done(function (data) {
							var data = JSON.parse(data);
							if (data.code === '000' || data.code === 'APPLY_SUCCESS') {
								util.toast('实名认证成功');
								util.baseLink('/src/account/index.html', 1000);
								/*$.ajax({
									url: Helper.basePath+'member/modifySinaPwd.htm?type=setPayPsw&uid='+_self.data.userInfo.id,
									type: 'POST',
									dataType: 'json',
									xhrFields: {
										withCredentials: true
									},
									data: {
										'pwdTransType':'set_pay_password',
										'retUrl':Helper.webPath+'src/base/loading.html'
									}
								})
								.done(function(data){
									var data = JSON.parse(data);
									if(data.code==='000'){
										window.location.href=data.redirectUrl;
									}
								})*/
							} else if (data.code === '5555') {
								util.toast('身份证已被使用');
							} else if (data.code === '4444') {
								util.toast('该账户已实名');
								util.baseLink('/src/account/index.html', 2000);
							} else if (data.code === '1111') {
								util.toast('未满18周岁不能进行实名认证！');
							} else if (data.code === 'DUPLICATE_VERIFY') {
								util.toast('身份证已被使用');
							} else {
								util.toast(data.message);
							}
						})
				}

			}
		}
	})
}