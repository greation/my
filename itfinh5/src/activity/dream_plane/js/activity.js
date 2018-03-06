var vm = {};
vm.re =function(){
	new Vue({
		el:'#re',
		data:{
			inSource:util.hrefSplit(window.location.href),
			isLogin:false,
			current_url:Helper.webPath + '/src/activity/dream_plane/index.html'
		},
		created:function(){
			var _slef = this;
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
				if(data.isLogin==='Y'||_slef.inSource.userId||android.getUserId()){
					_slef.isLogin = true;
				}
			})
			.fail(function() {})

		},
		methods:{
			//当前活动状态
					activeStatus:function () {
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
											'activityTypeStr':"DREAM_PLANE"
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
			ybLink1:function(){
				var _this=this;
				var type=1;
				sa.track('int_click',{campaignName:'9月梦想计划',lpUrl:this.current_url,elementId:$(".yblinkbg1").attr('id'),elementContent:'立即约标',elementName:'京东卡_800'});
				this.comMethosd(type);
			},
			ybLink2:function(){
				var _this=this;
				var type=2;
				sa.track('int_click',{campaignName:'9月梦想计划',lpUrl:this.current_url,elementId:$(".yblinkbg2").attr('id'),elementContent:'立即约标',elementName:'京东卡_2000'});
				this.comMethosd(type);
			},
			ybLink3:function(){
				var _this=this;
				var type=3;
				sa.track('int_click',{campaignName:'9月梦想计划',lpUrl:this.current_url,elementId:$(".yblinkbg3").attr('id'),elementContent:'立即约标',elementName:'京东卡_5000'});
				this.comMethosd(type);
			},
			ybLink4:function(){
				var _this=this;
				var type=4;
				sa.track('int_click',{campaignName:'9月梦想计划',lpUrl:this.current_url,elementId:$(".yblinkbg4").attr('id'),elementContent:'立即约标',elementName:'携程卡_500'});
				this.comMethosd(type);
			},
			ybLink5:function(){
				var _this=this;
				var type=5;
				sa.track('int_click',{campaignName:'9月梦想计划',lpUrl:this.current_url,elementId:$(".yblinkbg5").attr('id'),elementContent:'立即约标',elementName:'携程卡_1000'});
				this.comMethosd(type);
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
							window.location.href = '/src/base/login.html?bUrl=/src/activity/dream_plane/index.html';
						}
					})
				}
			}
		}

	})
}