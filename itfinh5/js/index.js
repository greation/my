//creat by gannicus on 2017/4/22
	var ga={}	
	ga.massege=function(){
		var vm = new Vue({
	el:"#app",
	data:{
		data:"",
		listData:[],
		icon:true
	},
	filters:{
		capitalize: function (value) {
      		if (!value) return ''
      			value = value/100
      			value =value.toFixed(0)
      			return value 
		},
      			
      	capitalizeg: function (value) {
      		if (!value) return ''
      			value =value.toFixed(1)
      			return value },
      	capitalizeq:function(value){
      		var value = (value || 0).toString(),value2="",result = '';
			  if(value.indexOf(".")!=-1){
			    nums=value.split(".");
			    value=nums[0];
			    value2="."+nums[1];
			  }
			  while (value.length > 3) {
			      result = ',' + value.slice(-3) + result;
			      value = value.slice(0, value.length - 3);
			  }
			  if (value) { result = value + result+value2; }
			  return result;
      	}

	},
	
	created:function(){
		
		var _this=this;
		$.ajax({
				type:"post",
				url:Helper.basePath + 'index.htm',
				async:false,
				data:"",
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(data){
					var data = JSON.parse(data);
					//alert(data.mainBorrow.borrowActivityIcon);
					_this.data=data;
					var sumTransMoney = _this.data.sumTransMoney;
					//_this.sumTransMoney=(sumTransMoney/10000).toFixed(2);
					data.sumTransMoney=(sumTransMoney/1000000).toFixed(2);

					_this.sumRegistNumber = util.toThousands(data.sumRegistNumber);

						/*for(var i=0; i<data.listBorrow.length;i++){
	                    	_this.borrowMoney = util.toThousands((data.listBorrow[i].borrowMoney-data.listBorrow[i].raiseMoney)/100);
							//alert(_this.borrowMoney);
							//alert(data.borrowMoney[i]);
						}*/

					},
				error:function(data){
					
				}
		});
		
  	},

	methods: {
		/*首页消息 小喇叭  */
		messageLink:function(){
                window.location.href="/src/index/message.html";
			
		},
		investRight:function(borrowId){
			var _this=this;
			$.ajax({
				type:"post",
				url:Helper.basePath + 'member/isLogin.htm',
				async:false,
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(loginData){
					loginData=JSON.parse(loginData);
					if(loginData.isLogin=='N'){
						 util.baseLink('/src/base/login.html?bUrl=/src/invest/list.html',2000);
					}else{
						window.location.href="/src/invest/project_detail.html?borrowId=" +borrowId+'&source=index';
						}
					},
				error:function(loginData){
					
				}
			});
			
		},
		projectLink:function(borrowId){
			$.ajax({
				type:"post",
				url:Helper.basePath + 'member/isLogin.htm',
				async:false,
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(loginData){
					loginData=JSON.parse(loginData);
					if(loginData.isLogin=='N'){
						util.baseLink('/src/base/login.html?bUrl=/src/index/index.html',1000);
					}else{
							window.location.href="/src/invest/project_home.html?borrowId=" + borrowId+'&source=index';
						}
					},
				error:function(loginData){
					
				}
			});	
		}
		
	}
});
	}


/*平台公告 notice.html*/
ga.messageTip=function(){
	var vm = new Vue({
	el:"#message_card",
	data:{
		data:"",
		pageIndex:1,
		pageSize:5,
		loadTxt:'加载更多...',
		items:[]
	},
	created:function(){
		var _this=this;	
		this.getData();
	},
	methods:{
		getData:function(){
			var _this=this;	
		$.ajax({
				type:"post",
				url:Helper.basePath + 'message/noticelist.htm',
				async:false,
				data:{pageIndex:_this.pageIndex,
					pageSize:_this.pageSize
					},
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(data){
					var data = JSON.parse(data);
	                    _this.data =data;
	                    for(var i=0; i<data.list.length;i++){
	                    	data.list[i].context=util.removeHTMLTag(data.list[i].context);
							_this.items.push(data.list[i]);
						}
	                    if(_this.pageIndex>=_this.data.page.totalCount){
						_this.loadTxt='没有更多的数据！';
					}
					 
					},
				error:function(data){
					
				}
			});
		},
		notice_detail:function(noticeId){
		   var _self=this;
		   window.location.href="notice_detail.html?id=" + noticeId;
		},
		loadMore:function(){
				if(this.pageIndex++ < this.data.page.totalCount){
					this.getData();
				}
		}
	}
});
}


//消息中心 首页 messages.html
ga.message=function(){
	var vm = new Vue({
	el:"#messageslist",
	data:{
		data:""
	},
	filters:{
		capitalize: function (value) {
      		if (!value) return ''
      			value = value/1000
      			value =value.toFixed(2)
      			return value }
	},
	
	created:function(){
		var _this=this;	
		$.ajax({
				type:"post",
				url:Helper.basePath + 'message/index.htm',
				async:false,
				data:"",
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(data){
					var data = JSON.parse(data);
					_this.data=data;
					if(data.isLogin==='Y'){
					}else{
            window.location.href="/src/base/login.html?bUrl=/src/index/message.html";
					 }
					},
				error:function(data){

				}
			});
	},
	methods:{
		
		/*message_detail:function(messageId){
		   var _self=this;
		   window.location.href="tips_detail.html?id=" + messageId;
		}*/

	}
});
}

/*消息提示列表 messages_tips.html */
ga.messages_list=function(){
	var vm = new Vue({
	el:"#messages_list",
	data:{
		data:"",
		pageIndex:1,
		pageSize:5,
		loadTxt:'加载更多...',
		items:[]
	},
	created:function(){
		var _this=this;
		this.getData();
	},
	methods:{
		getData:function(){
				var _this=this;	
		$.ajax({
				type:"post",
				url:Helper.basePath + 'message/messagelist.htm',
				async:false,
				data:{pageIndex:_this.pageIndex,
					pageSize:_this.pageSize,
					},
				datatype:"json",
				xhrFields: {withCredentials: true},
				success:function(data){
					var data = JSON.parse(data);
	                    _this.data =data;
	                    for(var i=0; i<data.list.length;i++){
	                    	data.list[i].context=util.removeHTMLTag(data.list[i].context);
							_this.items.push(data.list[i]);
						}
	                    if(_this.pageIndex>=_this.data.page.totalCount){
						_this.loadTxt='没有更多的数据！';
					}
	                    
					},
				error:function(data){
					
				}
			});
			},
		readAll:function(){
            var _self=this;
            $.ajax({
                url: Helper.basePath+'message/updateMsgALLRead.htm',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                data: {}
            })
            util.baseLink('/src/index/message_tips.html',100);
            util.toast('标记已读成功');

		},

        messages_detail:function(messageId){
            var _self=this;
            window.location.href="tips_detail.html?id=" + messageId;
        },
        loadMore:function(){
				if(this.pageIndex++ < this.data.page.totalCount){
					this.getData();
				}
		}





	}
	});
}


/*消息提示详情   tips_detail.html */
ga.messagesTip=function(){
	new Vue({
		el:'#messagesTip',
		data:{
			data:''
		},
		created:function(){
			var _self=this;
			var nowurl = document.URL;
			nowurl=location.href;
			var messageId=util.getRequest(nowurl,"id");
            var userId=util.getRequest(nowurl,"userId");
			$.ajax({
				url: Helper.basePath+'message/messageDetail.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {withCredentials: true},
				data:{"id":messageId,
				"userId":userId},

			})
			.done(function(data) {
				var data = JSON.parse(data);
				_self.data = data;
			})
			.fail(function() {
			})
		},
		methods:{

		}
	})
}



/*平台公告详情   notice_detail.html */
ga.noticeTip=function(){
	new Vue({
		el:'#noticeTip',
		data:{
			data:''
		},
		created:function(){
			var _self=this;
			var nowurl = document.URL;
			nowurl=location.href;
			var noticeId=util.getRequest(nowurl,"id");
			$.ajax({
				url: Helper.basePath+'message/noticeDetail.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {withCredentials: true},
				data:{"id":noticeId},

			})
			.done(function(data) {
				var data = JSON.parse(data);
				_self.data = data;

			})
			.fail(function() {
			})
		},
		methods:{
				loadMore:function(){
				if(this.pageIndex++ < this.data.page.totalCount){
					this.getData();
				}
		}
		}
	})
}
// 活动
ga.activity=function(){
	new Vue({
		el:'#activty_pop',
		data:{
			isActive: true,
			data:''
		},
		created:function(){
				var _this=this;
				$.ajax({
					url: Helper.basePath+'getHomeImage.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {withCredentials: true},
					data:{},
				})
				.done(function(data){
					var data = JSON.parse(data);
					 _this.data=data;
					 if(data.dialogType=='EVERY_TIME'){
						_this.isActive=false;
					 }else if(data.dialogType=='ONLY'){
						if (!localStorage.hidePop) {
							localStorage.hidePop = 1;
							_this.isActive=false;
						}
					 }else{
						_this.isActive=true;
					 }
				})
				.fail(function(data){

				})
		},
		methods:{
			close_activity:function(){
					var _this=this;
					_this.isActive=true;
		}
		}
	})
}