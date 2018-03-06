$(function () {
	awardImgHeight = $('.award_show_box').height();
	var addNumRoll = 0;
})
var redPackage = [
	[0, 1, 2], //加息券
	[1, 0, 1], //格瓦拉
	[2, 2, 0] //笔记本
];
//老虎机抽奖入口函数
function rollTransform(severalNum) {
	//初始化抽奖界面
	$('.line').css({
		'transform': 'translate(0px,0px)'
	});
	//添加动画
	$('.line img').css({
		'webkit-filter': 'blur(10px)',
		'filter': 'blur(2px);'
	});
	$('.line').css({
		'-webkit-animation': 'fx-roll 0.5s 0s 6 linear',
		'animation': 'fx-roll 0.5s 0s 6 linear'
	});
	//动画执行完毕参数移动到指定位置
	$('.line').eq(0).get(0).addEventListener('webkitAnimationEnd', function () {
		//去除动画 去掉毛玻璃效果
		$('.line').css({
			'-webkit-animation': '',
			'animation': ''
		});
		$('.line img').css({
			'webkit-filter': '',
			'filter': ''
		});
		for (var i = 0; i < 3; i++) {
			$('.line').eq(i).css({
				'-webkit-transform': 'translate(0px,' + (-redPackage[severalNum][i] * (awardImgHeight + 20)) + 'px)',
				'transform': 'translate(0px,' + (-redPackage[severalNum][i] * (awardImgHeight + 20)) + 'px)'
			});
		}
	})
}
//状态描述对象
var STEPVIEW = {
	one: {
		done: false
	},
	two: {
		done: false,
		isRealName: false
	},
	three: {
		done: false,
		received: false,
		receiveFunc: function () {
			this.received = true;
		}
	},
	four: {
		done: false,
		received: false,
		receiveFunc: function () {
			this.received = true;
		}
	},
	five: {
		done: false,
		received: false,
		receiveFunc: function () {
			this.received = true;
		}
	},
	six: {
		done: false,
		received: false,
		receiveFunc: function () {
			this.received = true;
		}
	},
	seven: {
		done: false,
		received: false,
		receiveFunc: function () {
			this.received = true;
		}
	}
}
//分享成功执行函数
var hrefDataPublic = util.hrefSplit(window.location.href);

function wxShareSuc() {
	$.ajax({
		url: Helper.basePath + 'stepWithGold/shareSuccess.htm',
		type: 'POST',
		dataType: 'json',
		async: false,
		xhrFields: {
			withCredentials: true
		},
		data: {
			userId: hrefDataPublic.userId
		}
	}).done(function (data) {
		var data = JSON.parse(data);
		if (data.code === '000') {
			vmObj.views.four.done = true;
		}
	})

}
//vue 实例
var vm = {};
var vmObj;
vm.index = function () {
	vmObj = new Vue({
		el: '#index',
		data: {
			views: STEPVIEW,
			angleNum: 0,
			interval01: '',
			interval02: '',
			investMoneyByYear: '',
			isTwo: false,
			ruleData: '',
			hrefData: util.hrefSplit(window.location.href),
			userData: {
				userInfo: {
					mobile: '13000000000'
				}
			},
			isLogin: false
		},
		created: function () {
			var _slef = this;
			this.userData = this.userInfo();

			this.animateSlow();
			this.viewDataInit();
			this.activeStatus();
		},
		computed: {
			AllReceive: function () {
				return this.views.one.done &&
					this.views.two.done &&
					this.views.three.received &&
					this.views.four.received &&
					this.views.five.received &&
					this.views.six.received
			}
		},
		methods: {
			viewDataInit: function () {
				var _self = this;
				$.ajax({
					url: Helper.basePath + 'stepWithGold/loadStatus.htm',
					type: 'POST',
					dataType: 'json',
					async: false,
					xhrFields: {
						withCredentials: true
					},
					data: {
						userId: this.hrefData.userId
					}
				}).done(function (data) {
					var data = JSON.parse(data);
					_self.investMoneyByYear = data.investMoneyByYear;
					console.log(data);

					if (data.code === '000') {
						//第一步判断初始化
						_self.isLogin = true;
						_self.views.one.done = true;

						//第二步判断初始化
						if (data.isBindCard === '2') {
							_self.views.two.done = true
						}
						if (data.isRealName === '2') {
							_self.views.two.done = true;
						}
						if (data.isUserRefer === '0') {
							_self.views.three.done = false
						} else if (data.isUserRefer === '1') {
							_self.views.three.done = true
						} else {
							_self.views.three.done = true;
							_self.views.three.received = true;
						}
						if (data.isShare === '0') {
							_self.views.four.done = false
						} else if (data.isShare === '1') {
							_self.views.four.done = true
						} else {
							_self.views.four.done = true;
							_self.views.four.received = true;
						}
						if (data.isInvest1 === '0') {
							_self.views.five.done = false
						} else if (data.isInvest1 === '1') {
							_self.views.five.done = true
						} else {
							_self.views.five.done = true;
							_self.views.five.received = true;
						}
						if (data.isInvest2 === '0') {
							_self.views.six.done = false
						} else if (data.isInvest2 === '1') {
							_self.views.six.done = true
						} else {
							_self.views.six.done = true;
							_self.views.six.received = true;
						}
						if (data.isInvest3 === '1') {
							_self.views.seven.done = true;
						} else if (data.isInvest3 === '3') {
							_self.views.seven.done = true;
						} else if (data.isInvest3 === '2') {
							_self.views.seven.done = true;
							_self.views.seven.received = true;
						}
					}
				})
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
					},
					data: {
						userId: this.hrefData.userId
					}
				}).done(function (data) {
					userJson = JSON.parse(data);
				})
				return userJson
			},
			//转盘抽奖
			drawRotateGo: (function () {
				var isAllowGo = true;
				return function () {
					var _self = this;
					if (isAllowGo) {
						var luckResult = this.luckyPostRotate();
						if (luckResult.code === '000') {
							_self.animateFast();
							_self.views.four.received = true;
							$('.pint_box').css('transform', 'rotate(' + (this.angleNum + 2880 + luckResult.prize * 60) + 'deg)');
							setTimeout(function () {
								util.toast(luckResult.message);
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
			drawTigerGo: (function () {
				var isAllowGo = true;
				return function () {
					var _self = this;
					if (isAllowGo) {
						var luckResult = this.luckyPostTiger();
						if (luckResult.code === '000') {
							_self.views.five.received = true;
							this.animateFast();
							$('.pint_box').addClass('pint_box_down');
							$('.hand_box').addClass('hand_box_two');
							//动画执行函数
							rollTransform(luckResult.prize);
							setTimeout(function () {
								util.toast(luckResult.message);
								$('.pint_box').removeClass('pint_box_down');
								$('.hand_box').removeClass('hand_box_two');
								//$('.line').css('transform','translateY(0px)');
								isAllowGo = true;
								_self.animateSlow();
							}, 3300);
							isAllowGo = false;
						} else {
							util.toast(luckResult.message);
						}
					}
				}
			}()),
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
						activityTypeStr: 'STEP_STEP_GOLD'
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
			},
			luckyPostRotate: function () {
				// var randomNum = ~~(Math.random() * 6); //模拟抽奖数据
				// return {
				// 	code: '000',
				// 	prize: 5
				// };
				var luckdata;
				$.ajax({
						url: Helper.basePath + 'stepWithGold/lottery1.htm',
						type: 'POST',
						dataType: 'json',
						async: false,
						xhrFields: {
							withCredentials: true
						},
						data: {
							userId: this.hrefData.userId
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
			luckyPostTiger: function () {
				// var randomNum = ~~(Math.random() * 3); //模拟抽奖数据
				// console.log(randomNum);
				// return {
				// 	code: '000',
				// 	prize: 0
				// };
				var luckdata;
				$.ajax({
						url: Helper.basePath + 'stepWithGold/lottery2.htm',
						type: 'POST',
						dataType: 'json',
						async: false,
						xhrFields: {
							withCredentials: true
						},
						data: {
							userId: this.hrefData.userId
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
			//注册
			goRegister: function () {
				if (this.views.one.done === true) {
					return;
				}
				if (this.hrefData.app === 'IPHONE') {
					window.webkit.messageHandlers.goRegister.postMessage('');
				} else if (this.hrefData.app === 'ANDROID') {
					android.goRegister();
				} else {
					window.location.href = '/src/base/register.html';
				}
			},
			//实名开户
			goRealName: function () {
				var _self = this;
				if (this.views.two.done === true) {
					return;
				}
				if (this.hrefData.app === 'IPHONE') {
					window.webkit.messageHandlers.bandCard.postMessage('');
				} else if (this.hrefData.app === 'ANDROID') {
					android.openAccount();
				} else {
					if (_self.isLogin) {
						window.location.href = '/src/base/real_name.html';
					} else {
						window.location.href = '/src/base/login.html?bUrl=/src/activity/step_gold/index.html';
					}
				}
			},
			//邀请奖励
			goInviteAWard: function () {
				var _self = this;
				if (this.views.three.received === true) {
					return;
				} else {
					if (this.views.three.done === true) {
						$.ajax({
								url: Helper.basePath + 'stepWithGold/getAward.htm',
								type: 'POST',
								dataType: 'json',
								async: false,
								xhrFields: {
									withCredentials: true
								},
								data: {
									type: '1',
									userId: this.hrefData.userId
								}
							})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
									_self.views.three.receiveFunc();
								}
							})
							.fail(function () {
								util.toast('网络异常');
							})
					} else {
						if (this.hrefData.app === 'IPHONE') {
							window.webkit.messageHandlers.goInvite.postMessage('');
						} else if (this.hrefData.app === 'ANDROID') {
							android.goInvite();
						} else {
							if (_self.isLogin) {
								window.location.href = '/src/account/my_ewm.html';
							} else {
								window.location.href = '/src/base/login.html?bUrl=/src/activity/step_gold/index.html';
							}
						}
					}
				}
			},
			//分享转盘抽奖
			drawLuck01: function () {
				var _self = this;
				if (this.views.four.received === true) {
					return;
				} else {
					if (this.views.four.done === true) {
						showLuck1();
					} else {
						if (this.hrefData.app === 'IPHONE') {
							window.webkit.messageHandlers.share.postMessage([Helper.webPath + '/src/activity/step_gold/images/wxshare.jpg', Helper.webPath + '/src/activity/step_gold/index.html', '通关有礼，步步生金', '通关不用打BOSS，轻松几步清空购物车！', 'STEP_STEP_GLOD_ACTIVITY']);
						} else if (this.hrefData.app === 'ANDROID') {
							android.share(Helper.webPath + '/src/activity/step_gold/images/wxshare.jpg', Helper.webPath + '/src/activity/step_gold/index.html', '通关有礼，步步生金', '通关不用打BOSS，轻松几步清空购物车！', 'STEP_STEP_GLOD_ACTIVITY');
						} else {
							$('.wxmask').show();
						}
					}
				}
			},
			//投资500抽奖
			drawLuck02: function () {
				var _self = this;
				if (this.views.five.received === true) {
					return;
				} else {
					if (this.views.five.done === true) {
						showLuck2();
					} else {
						if (this.hrefData.app === 'IPHONE' && this.hrefData.userId !== '') {
							window.webkit.messageHandlers.goInvest.postMessage('');
						} else if (this.hrefData.app === 'IPHONE' && this.hrefData.userId === '') {
							window.webkit.messageHandlers.login.postMessage('');
						} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId !== '') {
							android.goInvest();
						} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId === '') {
							android.login();
						} else {
							if (_self.isLogin) {
								window.location.href = '/src/invest/list.html';
							} else {
								window.location.href = '/src/base/login.html?bUrl=/src/activity/step_gold/index.html';
							}

						}
					}
				}
			},
			//跳转到投资列表01
			goInvestOne: function () {
				var _self = this;
				if (this.views.six.received === true) {
					return;
				} else {
					if (this.views.six.done === true) {
						$.ajax({
								url: Helper.basePath + 'stepWithGold/getAward.htm',
								type: 'POST',
								dataType: 'json',
								async: false,
								xhrFields: {
									withCredentials: true
								},
								data: {
									type: '2',
									userId: this.hrefData.userId
								}
							})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
									_self.views.six.receiveFunc();
								}
							})
							.fail(function () {
								util.toast('网络异常');
							})
					} else {
						if (this.hrefData.app === 'IPHONE' && this.hrefData.userId !== '') {
							window.webkit.messageHandlers.goInvest.postMessage('');
						} else if (this.hrefData.app === 'IPHONE' && this.hrefData.userId === '') {
							window.webkit.messageHandlers.login.postMessage('');
						} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId !== '') {
							android.goInvest();
						} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId === '') {
							android.login();
						} else {
							if (_self.isLogin) {
								window.location.href = '/src/invest/list.html';
							} else {
								window.location.href = '/src/base/login.html?bUrl=/src/activity/step_gold/index.html';
							}

						}
					}
				}
			},
			//跳转到投资列表02
			goInvestTwo: function () {
				var _self = this;
				if (this.views.seven.received) {
					return;
				}
				if (this.views.seven.done) {
					if (!_self.AllReceive) {
						util.toast('请先完成前面任务~');
					} else {
						$.ajax({
								url: Helper.basePath + 'stepWithGold/getAward.htm',
								type: 'POST',
								dataType: 'json',
								async: false,
								xhrFields: {
									withCredentials: true
								},
								data: {
									type: '3',
									userId: this.hrefData.userId
								}
							})
							.done(function (data) {
								var data = JSON.parse(data);
								if (data.code === '000') {
									_self.views.seven.receiveFunc();
								}
							})
							.fail(function () {
								util.toast('网络异常');
							})
					}
				} else {
					if (this.hrefData.app === 'IPHONE' && this.hrefData.userId !== '') {
						window.webkit.messageHandlers.goInvest.postMessage('');
					} else if (this.hrefData.app === 'IPHONE' && this.hrefData.userId === '') {
						window.webkit.messageHandlers.login.postMessage('');
					} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId !== '') {
						android.goInvest();
					} else if (this.hrefData.app === 'ANDROID' && this.hrefData.userId === '') {
						android.login();
					} else {
						if (_self.isLogin) {
							window.location.href = '/src/invest/list.html';
						} else {
							window.location.href = '/src/base/login.html?bUrl=/src/activity/step_gold/index.html';
						}

					}
				}
			},
			animateSlow: function () {
				var _self = this;
				clearInterval(this.interval02);
				this.interval01 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
				}, 760);
			},
			animateFast: function () {
				var _self = this;
				clearInterval(this.interval01);
				this.interval02 = setInterval(function () {
					_self.isTwo = !_self.isTwo;
				}, 60);
			},
			//是否微信浏览器
			isWxBorrow: function () {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			}
		}
	})
}