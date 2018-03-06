var vm = {};
vm.re =function(){
	new Vue({
		el:'#re',
		data:{
			inSource:util.hrefSplit(window.location.href),
			isLogin:false,
			current_url:Helper.webPath + '/src/activity/doubleEleven/index.html',
			ruleData:'',
			overActivity:false
		},
		created:function(){
			var _this = this;
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
				var data = JSON.parse(data);
				if(data.isLogin==='Y'||_this.inSource.userId||android.getUserId()){
					_this.isLogin = true;
				}
			})
			.fail(function() {})
		},
		methods:{
		
			//当前活动状态
					activeStatus:function () {
							var _this=this;
							var source = util.hrefSplit(window.location.href);
							var num = 0;
							$.ajax({
									url: Helper.basePath + 'activityTurntable/activity.htm',
									type: 'POST',
									dataType: 'json',
									async:false,
									xhrFields: {
											withCredentials: true
									},
									data:{
											'userId':source.userId,
											'activityTypeStr':"DOUBLEELEVEN"
									}
							})
							.done(function(data) {
								var data = JSON.parse(data);
								_this.ruleData = data.rule;
								if(data.code ==='999'){
									_this.overActivity =true;
//									util.confirmAct(data.message,'取消','好的',function(){
//										if(source.app==='IPHONE'){
//											window.webkit.messageHandlers.goInvest.postMessage('');
//										}else if(source.app==='ANDROID'){
//											android.goInvest();
//										}else{
//											window.location.href = '/src/invest/list.html';
//										}
//									});
//									$('.confirm_no').hide();
								}
				})
			},
			ybLink1:function(){
				var _this=this;
				var type=10;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".yblinkbg1").attr('id'),elementContent:'立即约标',elementName:'500元本来生活礼金卡'});
				if(_this.overActivity ){
					util.toast('活动已结束');
				}else{
					this.comMethosd(type);
				}
			},
			ybLink2:function(){
				var _this=this;
				var type=9;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".yblinkbg2").attr('id'),elementContent:'立即约标',elementName:'800元携程卡任我游礼品卡'});
				if(_this.overActivity ){
					util.toast('活动已结束');
				}else{
					this.comMethosd(type);
				}
			},
			ybLink3:function(){
				var _this=this;
				var type=8;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".yblinkbg3").attr('id'),elementContent:'立即约标',elementName:'1000元中石化加油卡'});
				if(_this.overActivity ){
					util.toast('活动已结束');
				}else{
					this.comMethosd(type);
				}
			},
			ybLink4:function(){
				var _this=this;
				var type=7;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".yblinkbg4").attr('id'),elementContent:'立即约标',elementName:'2000元京东E卡经典卡'});
				if(_this.overActivity ){
					util.toast('活动已结束');
				}else{
					this.comMethosd(type);
				}
			},
			ybLink5:function(){
				var _this=this;
				var type=6;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".yblinkbg5").attr('id'),elementContent:'立即约标',elementName:'iPhone X 256G'});
				if(_this.overActivity ){
					util.toast('活动已结束');
				}else{
					this.comMethosd(type);
				}
			},
			comMethosd:function(type){
				var _this=this;
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
							window.location.href = '/src/base/login.html?bUrl=/src/activity/doubleEleven/index.html';
						}
					})
				}
			}
		}

	})
}
vm.hw =function(){
	new Vue({
		el:'#zdpk',
		data:{
			inSource:util.hrefSplit(window.location.href),
			isLogin:false,
			current_url:Helper.webPath + '/src/activity/doubleEleven/index.html',
			status:'',
			time:'',
			singleDogNum:'',
			shopaholicNum:'',
			winClan:'',
			isActivityl:false,
			isActivityr:false,
			noDefault:false,
			clan:'',
			days:'',
			hours:'',
			minutes:'',
			seconds:'',
			showFirst:true,
			ruleData:'',
		},
		created:function(){
			var _this = this;
			this.activeStatus();
			this.timeAbiden();
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
				if(data.isLogin==='Y'||_this.inSource.userId||android.getUserId()){
					_this.isLogin = true;
				}
			})
			.fail(function() {})
			
		},
		methods:{
			activeStatus:function () {
							var _this=this;
							var source = util.hrefSplit(window.location.href);
							var num = 0;
							$.ajax({
									url: Helper.basePath + 'activityTurntable/activity.htm',
									type: 'POST',
									dataType: 'json',
									async:false,
									xhrFields: {
											withCredentials: true
									},
									data:{
											'userId':source.userId,
											'activityTypeStr':"DOUBLEELEVEN"
									}
							})
							.done(function(data) {
								var data = JSON.parse(data);
								_this.ruleData = data.rule;
								
				})
			},
			// 倒计时
			timeAbiden:function () {
				var _this=this;
				var source = util.hrefSplit(window.location.href).app;
				$.ajax({
						url: Helper.basePath +'/activityClan/clanInfo.htm',
						type: 'POST',
						dataType: 'json',
						async:false,
						xhrFields: {
							withCredentials: true
						},
						data:{}
					})
					.done(function(data) {
						var data = JSON.parse(data);
						_this.winClan =data.winClan;
						_this.status =data.status;
						_this.singleDogNum =data.singleDogNum;
						_this.shopaholicNum =data.shopaholicNum;
						_this.clan =data.clan;
						if(_this.clan==='SINGLE_DOG'){
							_this.isActivityl = true;
							_this.isActivityr =false;
						}
						if(_this.clan==='SHOPAHOLIC'){
							_this.isActivityl = false;
							_this.isActivityr =true;
						}
						if(data.status==='进行中'){
							_this.showFirst =false;
							_this.days =parseInt(data.time/1000/60/60/24) ;
							_this.hours =parseInt(data.time/1000/60/60%24) ;
							_this.minutes =parseInt(data.time/1000/60%60) ;
							_this.seconds =parseInt(data.time/1000%60) ;
							_this.days = _this.checkTime(_this.days);
				 			_this.hours = _this.checkTime(_this.hours); 
				 			_this.minutes = _this.checkTime(_this.minutes); 
 				 			_this.seconds = _this.checkTime(_this.seconds); 
							setInterval(function(){ 
									 _this.seconds--; 
									 if(_this.seconds<0){ 
									 _this.minutes--; 
									 _this.seconds = 59; 
									 } 
									 if(_this.minutes<0){ 
									 _this.hours--; 
									 _this.minutes = 59 
									 } 
									 if(_this.hours<0){ 
									 _this.days--; 
									 _this.hours = 23 
									 }},1000)}
						if(data.status==='即将开始'){
							util.toast('活动即将开始');
							window.location.href = '/src/activity/doubleEleven/index.html';
						}
						if(data.status==='已结束'){
							util.toast('活动已结束');
						}
						
						
					})
			},
			checkTime:function(i){
				var _this = this;
				if(i<10){
					i = "0" +i;}
				return i;
			},
			joinl:function(){
				var _this=this;
				var source = util.hrefSplit(window.location.href).app;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".joinl").attr('id'),elementContent:'加入单身狗战队',elementName:'单身狗'});
				if(_this.status==='已结束'){
					util.toast('活动已结束'); return false;
				}else{
					$.ajax({
					url: Helper.basePath +'activityClan/chooseClan.htm',
					type: 'POST',
					dataType: 'json',
					async:false,
					xhrFields: {withCredentials: true},
					data:{clan:'single_dog'}
				}).done(function(data) {
					var data = JSON.parse(data);
					if(_this.status==='已结束'){
						util.toast('活动已结束'); return false;
					}
					if(_this.status==='进行中'){
						if(_this.isLogin){
						if(_this.clan==='SINGLE_DOG'){
							_this.isActivityl = true;
							_this.isActivityr =false;
						}else{
							if(_this.isActivityr){
								util.toast('您已经加入购物狂战队');
							}else{
								if(!_this.noDefault){
									_this.isActivityl = true;
									_this.isActivityr =false;
									_this.singleDogNum = Number(_this.singleDogNum) + 1;
									_this.noDefault =true;
								}
							}
						}
						
					}else{
						util.confirmAct('请登录后加入战队','取消','去登录',function(){
						if(source==='IPHONE'){
							window.webkit.messageHandlers.login.postMessage('');
						}else if(source==='ANDROID'){
							android.login();
						}else{
							window.location.href = '/src/base/login.html?bUrl=/src/activity/doubleEleven/index.html';
						}
						})
					}
					}
				})
				}
				
				
			},
			joinr:function(){
				var _this=this;
				var source = util.hrefSplit(window.location.href).app;
				sa.track('int_click',{campaignName:'双11站内活动',lpUrl:this.current_url,elementId:$(".joinr").attr('id'),elementContent:'加入购物狂战队',elementName:'购物狂'});
				if(_this.status==='已结束'){
					util.toast('活动已结束'); return false;
				}else{
					$.ajax({
					url: Helper.basePath +'activityClan/chooseClan.htm',
					type: 'POST',
					dataType: 'json',
					async:false,
					xhrFields: {withCredentials: true},
					data:{clan:'shopaholic'}
				}).done(function(data) {
					var data = JSON.parse(data);
					if(_this.status==='已结束'){
						util.toast('活动已结束'); return false;
					}
					if(_this.status==='进行中'){
						if(_this.isLogin){
						if(_this.clan==='SHOPAHOLIC'){
							_this.isActivityr = true;
							_this.isActivityl =false;
						}else{
							if(_this.isActivityl){
								util.toast('您已经加入单身狗战队');
							}else{
								if(!_this.noDefault){
									_this.isActivityr = true;
									_this.isActivityl =false;
									_this.shopaholicNum = Number(_this.shopaholicNum) + 1;
									_this.noDefault =true;
								}
							}
						}
						
					}else{
						util.confirmAct('请登录后加入战队','取消','去登录',function(){
						if(source==='IPHONE'){
							window.webkit.messageHandlers.login.postMessage('');
						}else if(source==='ANDROID'){
							android.login();
						}else{
							window.location.href = '/src/base/login.html?bUrl=/src/activity/doubleEleven/index.html';
						}
						})
					}
					}
				})
				}
				
			}
		}

	})
}