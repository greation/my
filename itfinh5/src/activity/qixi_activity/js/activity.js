var giftsObj = {
	1:{
		i:3,
		name:'恭喜你抽中<br/>1200元Tiffany项链'
	},
	2:{
		i:6,
		name:'恭喜你抽中<br/>500元携程旅游卡'
	},
	3:{
		i:5,
		name:'恭喜你抽中<br/>格瓦拉电影券黄券两张'
	},
	4:{
		i:1,
		name:'恭喜你抽中<br/>爱奇艺VIP会员3个月'
	},
	5:{
		i:2,
		name:'恭喜你抽中1314积分'
	},
	6:{
		i:0,
		name:'恭喜你抽中<br/>0.77%加息券'
	},
	7:{
		i:7,
		name:'恭喜你抽中<br/>77元现金券'
	},
	8:{
		i:4,
		name:'客官，再接再厉哦',

	}
}

var lottery = {
	click:false, //
    index:-1,    //当前转动到哪个位置，起点位置
    count:0,     //总共有多少个位置
    timer:0,     //setTimeout的ID，用clearTimeout清除
    speed:200,   //初始转动速度
    times:0,     //转动次数
    cycle:40,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize:-1,    //中奖位置
    init:function(id){
        if ($("#"+id).find(".gift").length>0) {
            $lottery = $("#"+id);
            $units = $lottery.find(".gift");
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".gift"+this.index).addClass("active");
        };
    },
    roll:function(){
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".gift"+index).removeClass("active");
        index += 1;
        if (index>count-1) {
            index = 0;
        };
        $(lottery).find(".gift"+index).addClass("active");
        this.index=index;
        return false;
    },
    stop:function(index){
        this.prize=index;
        return false;
    }
};

function rolling(){
    lottery.times += 1;
    lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
    if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
        clearTimeout(lottery.timer);
        util.toast(giftsObj[prizeResult].name);
        lottery.prize=-1;
        lottery.times=0;
        lottery.click=false;
    }else{
        if (lottery.times<lottery.cycle) {
            lottery.speed -= 10;
        }else if(lottery.times==lottery.cycle) {
            lottery.prize = giftsObj[prizeResult].i;//获取奖品对应的列表i        
        }else{
            if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                lottery.speed += 50;
            }else{
                lottery.speed += 30;
            }
        }
        if (lottery.speed<80) {
            lottery.speed=80;
        };
        //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
        lottery.timer = setTimeout(rolling,lottery.speed);//循环调用
    }
    return false;
}
var prizeResult=-1;//中奖结果
$(".modal-rule").css('display','block');

var vm = {};
vm.index = function(){
	new Vue({
		el:'#index',
		data:{
			isLogin:false,
			ruleShow:false,
			investNum:0,
			inSource:util.hrefSplit(window.location.href),
			luckyUser:[]
		},
		created:function(){
			var _slef = this;
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
			showRule:function(f){
				this.ruleShow = !!f;
			},
			drawGo:function(){
				if (lottery.click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
    			    return false;
    			}else{
    				lottery.init('lottery');
    				prizeResult = this.luckyPost(); //奖品id 
    				if(prizeResult === 999){//
    					lottery.click=false;
    					return false;
    				}
    				lottery.speed = 200;
    			    rolling();    //转圈过程不响应click事件，会将click置为false
    			    lottery.click=true; //一次抽奖完成后，设置click为true，可继续抽奖
    			    return false;
    			}
			},
            //当前活动状态
            activeStatus:function () {
                var source = util.hrefSplit(window.location.href);
                var num = 0;
                $.ajax({
                    url: Helper.basePath + 'qixi/activity.htm',
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
                        $('.confirm_no').hide();//去除弹出 取消 btn
                    }
                })
            },
			luckyPost:function(){
				//return ~~(Math.random()*10);
				var source = util.hrefSplit(window.location.href);
				var num = 0;
				$.ajax({
					url: Helper.basePath + 'qixi/lottery.htm',
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
					if(data.code ==='0001'){
						util.confirmAct('请登录后进行抽奖','取消','去登录',function(){
							if(source.app==='IPHONE'){
								window.webkit.messageHandlers.login.postMessage('');
							}else if(source.app==='ANDROID'){
								android.login();
							}else{
								window.location.href = '/src/base/login.html?bUrl=/src/activity/qixi_activity/index.html';
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
					}else if(data.code === '999'){
						util.toast(data.message);
					}else if(data.code === '0003'){
						util.confirmAct('投资满5000元且标的期限≥6个月<br/>听说有惊喜哟','取消','去投资',function(){
							if(source.app==='IPHONE'){
								window.webkit.messageHandlers.goInvest.postMessage('');
							}else if(source.app==='ANDROID'){
								android.goInvest();
							}else{
								window.location.href = '/src/invest/list.html';
							}
						});
					}
					num = 999;
					if(data.code==='000'){
						num = data.prize;
					}
				})
				.fail(function() {
					num = 8;//网络错误 默认为再接再厉
					//util.toast('客官，再接再厉哦');
				})
				return num;
			},
			loginNow:function(){
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
					util.confirmAct('请登录后进行查看','取消','去登录',function(){
						if(source==='IPHONE'){
							window.webkit.messageHandlers.login.postMessage('');
						}else if(source==='ANDROID'){
							android.login();
						}else{
							window.location.href = '/src/base/login.html?bUrl=/src/activity/qixi_activity/index.html';
						}
					})
				}
			},
			getLuckUser:function(){
				var _self = this;
				var userID = _self.inSource.userId;
				$.ajax({
					url: Helper.basePath + 'qixi/winnerList.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data:{
						'userId':userID
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					data.winnerList.forEach(function(list){
						list[1] = list[1].replace('七夕','');
					});
					var result =[];
					for(var i=0;i<data.winnerList.length;i+=3){
						result.push(data.winnerList.slice(i,i+3));
					}
					_self.investNum = data.totalInvestMoney||0;//活动期间累计投资金额
					//console.log(data);
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
					window.webkit.messageHandlers.share.postMessage([Helper.webPath+'/src/activity/qixi_activity/images/wxshare.jpg',Helper.webPath+'/src/activity/one_anniversary/index.html','相约浪漫七夕，好礼甜蜜来袭','七夕缤纷好礼，周大福钻戒等大奖浪漫呈现']);
				}else if(source==='ANDROID'){
					android.share(Helper.webPath+'/src/activity/qixi_activity/images/wxshare.jpg',Helper.webPath+'/src/activity/qixi_activity/index.html','相约浪漫七夕，好礼甜蜜来袭','七夕缤纷好礼，周大福钻戒等大奖浪漫呈现');
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
vm.index();