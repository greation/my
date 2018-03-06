var vm = {};
vm.index = function(){
	new Vue({
		el:'#index',
		data:{
			angleNum:0,
			isTwo:false,
			isLogin:false,
			inSource:util.hrefSplit(window.location.href),
			interval01:'',
			interval02:'',
			luckyUser:[],
			awardText:['7.15元现金券','1.5%加息券','喜马拉雅98喜点','715元现金券','格瓦拉电影红券','爱奇艺黄金VIP3个月','71.5元现金券','喜马拉雅46喜点','2%加息券','爱奇艺黄金VIP1个月']
		},
		created:function(){
			var _slef = this;
			this.animateSlow();
			this.getLuckUser();
			this.activeStatus();
			$.ajax({
				url: Helper.basePath + 'member/getUser.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			})
			.done(function(data) {
				console.log(_slef.inSource);
				var data = JSON.parse(data);
				if(data.isLogin==='Y'||_slef.inSource.userId){
					_slef.isLogin = true;
				}
			})
			.fail(function() {})
		},
		methods:{
			drawGo:(function(){
				var isAllowGo = true;
				return function(){
					var _self = this;   
					if(isAllowGo){
						var sNum = this.luckyPost();
						if(sNum !== 999){
							this.animateFase();
							$('.pint_box').css('transform','rotate('+(this.angleNum+2880+sNum*36)+'deg)');
							setTimeout(function(){
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
            activeStatus:function () {
                var source = util.hrefSplit(window.location.href);
                var num = 0;
                $.ajax({
                    url: Helper.basePath + 'turntable/activity.htm',
                    type: 'POST',
                    dataType: 'json',
                    async:false,
                    xhrFields: {
                        withCredentials: true
                    },
                    data:{
                        'userId':source.userId
                    }
                }).done(function(data) {
                        var data = JSON.parse(data);
                        //console.log(data);
               
                        if(data.code ==='999'){
                            util.confirmAct(data.message,'取消','好的',function(){
                                if(source.app==='IPHONE'){
                                    window.webkit.messageHandlers.goInvest.postMessage('');
                                }else if(source.app==='ANDROID'){
                                    android.goInvest();
                                }else{
                                    window.location.href = '/src/invest/list.html';
                                }
                            });
                            $('.confirm_no').hide();
                        }
					})
            },
			luckyPost:function(){
				//return ~~(Math.random()*10);
				var source = util.hrefSplit(window.location.href);
				var num = 0;
				$.ajax({
					url: Helper.basePath + 'turntable/lottery.htm',
					type: 'POST',
					dataType: 'json',
					async:false,
					xhrFields: {
						withCredentials: true
					},
					data:{
						'userId':source.userId
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					console.log(data);
					if(data.code ==='0001'){
						util.confirmAct('请登录后进行抽奖','取消','去登录',function(){
							if(source.app==='IPHONE'){
								window.webkit.messageHandlers.login.postMessage('');
							}else if(source.app==='ANDROID'){
								android.login();
							}else{
								window.location.href = '/src/base/login.html?bUrl=/src/activity/one_anniversary/index.html';
							}
						});
					}else if(data.code === '0002'){
						util.confirmAct('请实名后进行抽奖','取消','去实名',function(){
							if(source.app==='IPHONE'){
								window.webkit.messageHandlers.goAuthentication.postMessage('');
							}else if(source.app==='ANDROID'){
								android.goAuthentication();
							}else{
								window.location.href = '/src/base/real_name.html';
							}
						});
					}else if(data.code === '0003'){

						util.toast(data.message);//分享可再次抽奖哟~

					}else if(data.code === '999'){//
                        util.confirmAct(data.message,'取消','好的',function(){
                            window.location.href = '/src/invest/list.html';
                        });
					}
					num = 999;
					if(data.code==='000'){
						num = data.prize;
					}
				})
				.fail(function() {
					num = 999;
					util.toast('网络异常');
				})
				return num;
			},
			ybLink:function(type){
				var source = util.hrefSplit(window.location.href).app;
				if(this.isLogin){
					if(source==='IPHONE'){
						window.webkit.messageHandlers.reserveWithType.postMessage(type);
					}else if(source==='ANDROID'){
						android.goReserve(type);
					}else{
						window.location.href = '/src/invest/deal.html?type='+type;
					}
				}else{
					util.confirmAct('请登录后进行约标','取消','去登录',function(){
						if(source==='IPHONE'){
							window.webkit.messageHandlers.login.postMessage('');
						}else if(source==='ANDROID'){
							android.login();
						}else{
							window.location.href = '/src/base/login.html?bUrl=/src/activity/one_anniversary/index.html';
						}
					})
				}
			},
			animateSlow:function(){
				var _self = this;
				clearInterval(this.interval02);
				this.interval01 = setInterval(function(){
					_self.isTwo = !_self.isTwo;
				},760);
			},
			animateFase:function(){
				var _self = this;
				clearInterval(this.interval01);
				this.interval02 = setInterval(function(){
					_self.isTwo = !_self.isTwo;
				},60);
			},
			getLuckUser:function(){
				var _self = this;
				$.ajax({
					url: Helper.basePath + 'turntable/winnerList.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					var result =[];
					for(var i=0;i<data.winnerList.length;i+=3){
						result.push(data.winnerList.slice(i,i+3));
					}
					_self.luckyUser = result;
					//初始化swiper
					setTimeout(function(){
						new Swiper('.swiper-lucky', {
							direction:'vertical',
				    	  	speed: 400,
				    	  	spaceBetween:0,
				    	  	loop : true,
				    	  	autoplay : 4000,
				    	  	onlyExternal : true,//禁止手动滑动
				    	  	observer: true,//自身及子元素改变刷新
				    	  	observeParents: true//父元素改变刷新
				  		});
					}, 10);
				})
				.fail(function() {})
			},
			isWxBorrow:function(){
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i)=="micromessenger") {
					return true;
				} else {
					return false;
				}
			},
			goShare:function(){
				var source = this.inSource.app;
				if(source==='IPHONE'){
					window.webkit.messageHandlers.share.postMessage([Helper.webPath+'/src/activity/one_anniversary/images/wxshare.jpg',Helper.webPath+'/src/activity/one_anniversary/index.html','宜泉资本1周年，感谢“宜”路有你','狂欢周年庆，感恩大派送。千万红包雨来袭、更有京东E卡、携程旅行卡等众多豪礼领到手软！','ANNIVERSARY_TURNTABLE_ACTIVITY']);
				}else if(source==='ANDROID'){
					android.share(Helper.webPath+'/src/activity/one_anniversary/images/wxshare.jpg',Helper.webPath+'/src/activity/one_anniversary/index.html','宜泉资本1周年，感谢“宜”路有你','狂欢周年庆，感恩大派送。千万红包雨来袭、更有京东E卡、携程旅行卡等众多豪礼领到手软！','ANNIVERSARY_TURNTABLE_ACTIVITY');
				}else if(this.isWxBorrow()){
					$('.mask').show();
				}else{
					createBg();
					$('.borwser_tip').show();
				}
			}
		}
	})
};
vm.letter = function(){
	var lo_vm=new Vue({
	el:'#letter',
	data:{
		inpPhone:'',
  	inpPsw:'',
  	inPsActive:[false,false],
  	isOpenEye:true,
  	showClearPsw:false,
  	showClearPhone:false,
  	isLogin:false,
  	userData:''
	},
	created:function(){
		var _self = this;
		this.getLetterData();
	},
	methods:{
		loginMain:function(){
			var _self=this;
  		var phoneState=util.checkPhone(this.inpPhone);
  		var pswState=util.checkPsw(this.inpPsw);
  		var stateArr=[];
  		if(phoneState!==true){
  			stateArr.push(phoneState);
  			$('.inp_phone').focus();
  		}else{
  			if(pswState!==true){
	  			stateArr.push(pswState);
	  			$('.inp_psw').focus();
	  		}
  		}
  		if(phoneState===true&&pswState===true){
  			$.ajax({
	  			url: Helper.basePath+'login.htm',
	  			type: 'POST',
	  			dataType: 'json',
	  			xhrFields: {withCredentials: true},
	  			data: {'username':this.inpPhone,'password':this.inpPsw,'token_id':tokenId}
	  		})
	  		.done(function(data) {
	  			var data=JSON.parse(data);
	  			if(data.code==='000'){
	  				util.toast('登录成功');
	  				hideGz();
	  				_self.getLetterData();
	  				mySwiperLucky.slideNext();
	  				mySwiperLucky.enableTouchControl();
	  			}else if(data.code==='6008'){
	  				util.toast('密码错误');
	  			}else if(data.code==='2001'){
	  				util.toast('密码不能为空');
	  			}else if(data.code==='2002'){
	  				util.toast('密码格式不正确');
	  			}else if(data.code==='1002'){
	  				util.toast('手机号不存在');
	  			}else if(data.code==='1001'){
	  				util.toast('手机号码格式错误');
	  			}else if(data.code==='6001'){
	          util.toast('您的手机号还未注册！');
	        }else if(data.code==='999'){
	  				util.toast('系统异常');
	  			}/*else if(data.code === '7008'){
						util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服');
					}*/
	  		})
  		}else{
  			util.toast(stateArr[0]);
  			stateArr=[];
  		}
		},
		inpFocus:function(num){
  		this.inPsActive=[false,false];
  		this.inPsActive[num] = true;
  		this.showClearPhone = false;
  		this.showClearPsw = false;
  		if(num===0){
  			if(this.inpPhone.length>0){
  				this.showClearPhone = true;
  			}else{
  				this.showClearPhone = false;
  			}
  		}else if(num===1){
  			if(this.inpPsw.length>0){
  				this.showClearPsw = true;
	  		}else{
	  			this.showClearPsw = false;
	  		}
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
  	},
  	eyePsw:function(){
  		this.isOpenEye = !this.isOpenEye;
  	},
  	keyUpInp:function(num){
  		if(num===0){
  			if(this.inpPhone.length>0){
	  			this.showClearPhone = true;
	  		}else{
	  			this.showClearPhone = false;
	  		}
  		}else if(num===1){
  			if(this.inpPsw.length>0){
	  			this.showClearPsw = true;
	  		}else{
	  			this.showClearPsw = false;
	  		}
  		}
  	},
  	openLetter:function(){
  		if(this.isLogin){
  			mySwiperLucky.slideNext();
			}else{
				$('.login_box').show();
				createBg();
			}
  	},
  	getLetterData:function(){
  		var _self = this;
  		$.ajax({
				url: Helper.basePath+'member/thank.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {withCredentials: true}
			})
			.done(function(data) {
				var data=JSON.parse(data);
				if(data.isLogin === 'Y'){
					_self.isLogin = true;
					_self.userData = data;
					if(data.hasInvest==='0'){
						mySwiperLucky.removeSlide([2, 3, 4]);
					}
				}else{
					mySwiperLucky.disableTouchControl();
				}
			});
  	}
	}
})
}