var vms={};
vms.index = function(){
  new Vue({
    el:'#index',
    data:{
      curData:null,
      isDataEmpty:false,
      userInfo:null,
      hrefJson:util.hrefSplit(window.location.href),
      isLogin:false,
      actData:null
    },
    created:function(){
      var _self = this;
      this.getUserList('1');
      this.getActState();
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
        if(data.isLogin==='Y'||_self.hrefJson.userId){
          _self.isLogin = true;
				}
			})
			.fail(function() {util.toast('系统错误')})
    },
    computed:{
      lastRankList:function(){
        return this.curData.list.slice(3);
      }
    },
    methods:{
      getUserList:function(num){
        var _self = this;
        $.ajax({
          url: Helper.basePath+'activity/groupPointlist.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            type:num,
            userId:_self.hrefJson.userId
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.list.length<1){
            _self.isDataEmpty = true;
          }
          if(data.list.length<10){
            for(var i = data.list.length;i<10;i++ ){
              data.list.push({'name':'暂无用户','pic':'/src/activity/growth_value/images/photo.jpg','point':'---'});
            }
          }
          _self.curData = data;
        })
      },
      getActState:function(){
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
						activityTypeStr: 'YQ_USER_GROW_POINT'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
          _self.actData = data;
          if (data.code !== '000') {
						util.alert(data.message, function () {
							window.location.href = '/src/index/index.html';
						})
					}
				})
      },
      selectTime:function(index){
        var _self = this;
        $('.time_nav .item').removeClass('active').eq(index).addClass('active');
        $('.link_prev_text').hide().eq(index).show();
        if(index===0){
          _self.getUserList('1');
        }else{
          _self.getUserList('3');
        }
      },
      goLogin:function(){
        if (this.hrefJson.app === 'IPHONE') {
					window.webkit.messageHandlers.login.postMessage('');
				} else if (this.hrefJson.app === 'ANDROID') {
					android.login();
				} else {
					window.location.href = '/src/base/login.html?bUrl=/src/activity/growth_value/';
				}
      },
      goInvest:function(){
        if (this.hrefJson.app === 'IPHONE') {
					window.webkit.messageHandlers.goInvest.postMessage('');
				} else if (this.hrefJson.app === 'ANDROID') {
					android.goInvest();
				} else {
					window.location.href = '/src/invest/list.html';
				}
      },
      prevWeek:function(){
        if (this.hrefJson.app === 'IPHONE') {
          if(this.hrefJson.userId){
            window.location.href = 'prev_cycle.html?type=2&userId='+this.hrefJson.userId+'&app='+this.hrefJson.app;
          }else{
            window.location.href = 'prev_cycle.html?type=2&userId=&app='+this.hrefJson.app;
          }
				} else if (this.hrefJson.app === 'ANDROID') {
          if(this.hrefJson.userId){
            window.location.href = 'prev_cycle.html?type=2&userId='+this.hrefJson.userId+'&app='+this.hrefJson.app;
          }else{
            window.location.href = 'prev_cycle.html?type=2&userId=&app='+this.hrefJson.app;
          }
				} else {
					window.location.href = 'prev_cycle.html?type=2';
				}
      },
      prevMonth:function(){
        if (this.hrefJson.app === 'IPHONE') {
          if(this.hrefJson.userId){
            window.location.href = 'prev_cycle.html?type=4&userId='+this.hrefJson.userId+'&app='+this.hrefJson.app;
          }else{
            window.location.href = 'prev_cycle.html?type=4&userId=&app='+this.hrefJson.app;
          }
				} else if (this.hrefJson.app === 'ANDROID') {
          if(this.hrefJson.userId){
            window.location.href = 'prev_cycle.html?type=4&userId='+this.hrefJson.userId+'&app='+this.hrefJson.app;
          }else{
            window.location.href = 'prev_cycle.html?type=4&userId=&app='+this.hrefJson.app;
          }
				} else {
					window.location.href = 'prev_cycle.html?type=4';
				}
      }
    }
  })
}
vms.prevCycle = function(){
  new Vue({
    el:'#prev_cycle',
    data:{
      curData:null,
      userInfo:null,
      hrefJson:util.hrefSplit(window.location.href),
      isLogin:false
    },
    created:function(){
      var _self = this;
      this.getUserList(this.hrefJson.type);
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
        if(data.isLogin==='Y'||_self.hrefJson.userId){
          _self.isLogin = true;
				}
			})
			.fail(function() {util.toast('系统错误')})
    },
    computed:{
      lastRankList:function(){
        return this.curData.list.slice(3);
      }
    },
    methods:{
      getUserList:function(num){
        var _self = this;
        $.ajax({
          url: Helper.basePath+'activity/groupPointlist.htm',
          type: 'POST',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            type:_self.hrefJson.type,
            userId:_self.hrefJson.userId
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.list.length<10){
            for(var i = data.list.length;i<10;i++ ){
              data.list.push({'name':'暂无用户','pic':'/src/activity/growth_value/images/photo.jpg','point':'---'});
            }
          }
          _self.curData = data;
        })
      },
      goLogin:function(){
        if (this.hrefJson.app === 'IPHONE') {
					window.webkit.messageHandlers.login.postMessage('');
				} else if (this.hrefJson.app === 'ANDROID') {
					android.login();
				} else {
					window.location.href = '/src/base/login.html?bUrl=/src/activity/growth_value/';
				}
      },
      goInvest:function(){
        if (this.hrefJson.app === 'IPHONE') {
					window.webkit.messageHandlers.goInvest.postMessage('');
				} else if (this.hrefJson.app === 'ANDROID') {
					android.goInvest();
				} else {
					window.location.href = '/src/invest/list.html';
				}
      }
    }
  })
}
vms.rule=function(){
  new Vue({
    el:'#rule',
    data:{
      actData:null
    },
    created:function(){
      this.getActState();
    },
    methods:{
      getActState:function(){
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
						activityTypeStr: 'YQ_USER_GROW_POINT'
					}
				}).done(function (data) {
					var data = JSON.parse(data);
          _self.actData = data;
          if (data.code !== '000') {
						util.alert(data.message, function () {
							window.location.href = '/src/index/index.html';
						})
					}
				})
      }
    }
  })
}