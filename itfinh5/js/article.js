var active ={}

active.index =function(){
	new Vue({
	    el:"#re",
	    data:{
	        listData:[], 
	        urData:util.hrefSplit(window.location.href)
	    },
	    created:function(){
	        this.ajaxPost();
	    },
	    methods:{
	        ajaxPost:function(o){
	            var ordThis =this;
	            $.ajax({
	                type:"post",
	                url:Helper.basePath + 'news/index.htm',
	                async:false,
	                data:{},
	                datatype:"json",
	                xhrFields: {withCredentials: true},
	                success:function(data){
	                    var _data = JSON.parse(data);
	                    ordThis.listData =_data;
					 						for(var i=0; i<_data.articleList.length;i++){
						            _data.articleList[i].context =util.removeHTMLTag(_data.articleList[i].context);
											}
											for(var i=0; i<_data.newsList.length;i++){
						            _data.newsList[i].imgUrl =  _data.newsList[i].imgUrl.split(';');
											}
	                },
	                error:function(data){

	                }
	            });
	        },
	        hotlink:function(id){
	    	window.location.href="news_detail.html?noticeId=" + id;
	    	},
		    medialink:function(id){
		    	window.location.href="news_detail.html?noticeId=" + id;
		    }
	    }
	    
	})
}
active.list =function(){
	new Vue({
	    el:"#list",
	    data:{
	      listData:[],
	      urData:util.hrefSplit(window.location.href),
				data:'',
				pageIndex:1,
				pageSize:20,
		    loadTxt:'加载更多...',
		    isChuli:false
		  },
	    created:function(){
	      this.ajaxPost();
	    },
	    methods:{
        ajaxPost:function(o){
            var _this =this;
            $.ajax({
                type:"post",
                url:Helper.basePath + 'activity/list.htm',
                async:false,
                data:{
                	pageSize:this.pageSize,
        					pageIndex:this.pageIndex
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                  var data = JSON.parse(data);
                  _this.data =data;
                  for(var i=0;i<data.list.length;i++){
                  	//data.list[i].timeText = "222";
                  	_this.listData.push(data.list[i]);
                  	/*var time=_this.data.list[0].endDate;
                  	var timearr=time[0].replace(" ",":").replace(/\:/g,"-").split("-"); 
                  	console.log(timearr[0]);*/
                  }
                  if(_this.pageIndex>=_this.data.page.pageCount){
										_this.loadTxt='没有更多的数据！';
									}
									_this.startTimeEnd();
			          },
                error:function(data){

                }
            });
        	},
					ShowCountDown:function (year,month,day,hour,min,second) { 
						var now = new Date(); 
						var endDate = new Date(year, month-1, day,hour,min,second); 
						var leftTime = endDate.getTime() - now.getTime(); 
						var leftsecond = parseInt(leftTime/1000); 
						var day1 = Math.floor(leftsecond/(60*60*24)); 
						var hour = Math.floor((leftsecond-day1*24*60*60)/3600); 
						var minute = Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
						var second = Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
						return day1+"天"+hour +"时"+minute+"分<span style='color:#f00'>"+second+"秒</span>";
					}, 
	        loadMore:function(){
						if(this.pageIndex++ < this.data.page.pageCount){
							this.ajaxPost();
						}
					},
					startTimeEnd:function(){
						var _self = this;
						var endDataArr=[];
						for(var i=0;i<this.listData.length;i++){
							var timearr = this.listData[i].endDate.replace(" ",":").replace(/\:/g,"-").split("-"); 
              var year=timearr[0];
              var month=timearr[1];
              var day=timearr[2];
              var hour=timearr[3];
              var min=timearr[4];
              var second=timearr[5];
              endDataArr.push({year:year,month:month,day:day,hour:hour,min:min,second:second})
							var interval = window.setInterval((function(n,endDataArr){
								return function(){
									_self.isChuli = true;
									_self.listData[n].endDate = _self.ShowCountDown(endDataArr[n].year,endDataArr[n].month,endDataArr[n].day,endDataArr[n].hour,endDataArr[n].min,endDataArr[n].second);
									//Vue.set(_self.listData[n],'timeText',_self.ShowCountDown(year,month,day,hour,min,second));
								}
							})(i,endDataArr),1000);
						}

					},
			activitylink:function(id){
				/*app 调用参数 */
				var _this = this;
				var nowurl=document.URL;
				nowurl=location.href;
				var  userId=util.getRequest(nowurl,"userId");
				if (util.getUrlParam('app') == 'IPHONE') {
					window.location.href="/src/article/activity_detail.html?id="+id+"&app=IPHONE&userId="+userId+"&title=no";
				} else if (util.getUrlParam('app') == 'ANDROID') {
					window.location.href="/src/article/activity_detail.html?id="+id+"&app=ANDROID&userId="+userId +"&title=no" ;
				} else {
					window.location.href="/src/article/activity_detail.html?id="+id;
				}
			}
					
	    }
	})
}
active.acdetail =function(){
	new Vue({
	    el:"#acdetail",
	    data:{
	        data:'',
	        urData:util.hrefSplit(window.location.href),
	        isChuli:false
	    },
	    created:function(){
	        this.ajaxPost();
//	        this.timeOut();
	        //setInterval(this.timeOut(),1000); 
	    },
	    methods:{
	        ajaxPost:function(o){
	            var _this =this;
	            $.ajax({
	                type:"post",
	                url:Helper.basePath + 'activity/detail.htm',
	                async:false,
	                data:{
	                	activityId:_this.urData.id
	                },
	                datatype:"json",
	                xhrFields: {withCredentials: true},
	                success:function(data){
	                    var data = JSON.parse(data);
	                    _this.data =data;
	                    _this.startTimeEnd();
	                },
	                error:function(data){

	                }
	            });
	        },
	        ShowCountDown:function (year,month,day,hour,min,second) { 
						var now = new Date(); 
						var endDate = new Date(year, month-1, day,hour,min,second); 
						var leftTime = endDate.getTime() - now.getTime(); 
						var leftsecond = parseInt(leftTime/1000); 
						var day1 = Math.floor(leftsecond/(60*60*24)); 
						var hour = Math.floor((leftsecond-day1*24*60*60)/3600); 
						var minute = Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
						var second = Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
						return day1+"天"+hour +"时"+minute+"分<span style='color:#f00'>"+second+"秒</span>";
					},
					startTimeEnd:function(){
						var _self = this;
						var timearr = this.data.activity.endDate.replace(" ",":").replace(/\:/g,"-").split("-"); 
            var year=timearr[0];
            var month=timearr[1];
            var day=timearr[2];
            var hour=timearr[3];
            var min=timearr[4];
            var second=timearr[5];
						window.setInterval(function(){
								_self.isChuli = true;
								_self.data.activity.endDate = _self.ShowCountDown(year,month,day,hour,min,second);
							},1000)
					},
			joinActict:function(){
		   		var _this=this;
				var nowurl=document.URL;
				nowurl=location.href;
				var  id=util.getRequest(nowurl,"id");
				var  userId=util.getRequest(nowurl,"userId");
				if (util.getUrlParam('app') == 'IPHONE') {
					window.location.href=_this.data.activity.activityUrl+"?id="+id+"&app=IPHONE&userId="+userId+"&title=no";
				} else if (util.getUrlParam('app') == 'ANDROID') {
					window.location.href=_this.data.activity.activityUrl+"?id="+id+"&app=ANDROID&userId="+userId +"&title=no" ;
				} else {
					util.baseLink(_this.data.activity.activityUrl,0)
				}
			}
		   		
		   		
		   }
	   
	   
	})
}
active.media =function(){
	new Vue({
		el:"#mediaNew",
		data:{
	        data:'',
	        pageIndex:1,
	        pageSize:5,
	        items:[],
	        loadTxt:'加载更多...'
	    },
	    created:function(){
	        this.getData();
	    },
	    methods:{
	    	getData:function(){
	    		var _this =this;
	    		$.ajax({
	    			type:"post",
	    			url:Helper.basePath + 'article/mediaData.htm',
	    			async:false,
	    			data:{
	    				pageIndex:this.pageIndex,
	    				pageSize:this.pageSize
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
	    				if(_this.pageIndex>=_this.data.pUtil.pageCount){
	    					_this.loadTxt='没有更多的数据！';
	    				}
	    			},
	    			error:function(data){

	    			}
	    		});
	       },
	        loadMore:function(){
				if(this.pageIndex++ < this.data.pUtil.pageCount){
					this.getData();
				}
			},
			newin:function(noticeId){
				
				window.location.href="news_detail.html?noticeId=" + noticeId;
			}
	    }
	});
}
active.hoteNew =function(){
	new Vue({
		el:"#hotNew",
		data:{
	        data:'',
	        pageIndex:1,
	        pageSize:10,
	        items:[],
	        loadTxt:'加载更多...'
	    },
	    created:function(){
	        this.getData();
	    },
	    methods:{
	    	getData:function(){
          var _this =this;
          $.ajax({
              type:"post",
              url:Helper.basePath + 'article/newsData.htm',
              async:false,
              data:{
              	pageIndex:this.pageIndex,
              	pageSize:this.pageSize
              },
              datatype:"json",
              xhrFields: {withCredentials: true},
              success:function(data){
                var data = JSON.parse(data);
                _this.data =data;
                for(var i=0;i<data.list.length;i++){
                	data.list[i].context=util.removeHTMLTag(data.list[i].context);
			            data.list[i].imgUrl =  data.list[i].imgUrl.split(';');
									_this.items.push(data.list[i]);
                }
                if(_this.pageIndex>=_this.data.page.pageCount){
                	_this.loadTxt='没有更多的数据！';
                }
              },
              error:function(data){

              }
          });
	       },
	       loadMore:function(){
				if(this.pageIndex++ < this.data.page.pageCount){
					this.getData();
				}
			},
			newin:function(noticeId){
				window.location.href="news_detail.html?noticeId=" + noticeId;
			
			}
	    }
	});
}
//新闻详情
active.newDetail =function(){
	new Vue({
		el:"#newDetail",
		data:{
	        data:''
	    },
	    created:function(){
	        this.getData();
	    },
	    methods:{
	    	getData:function(){
	            var _this =this;
	            var nowurl = document.URL;
				nowurl=location.href;
				var noticeId=util.getRequest(nowurl,"noticeId");
	            $.ajax({
	                type:"post",
	                url:Helper.basePath + 'article/detail.htm',
	                async:false,
	                data:{
	                	articleId:noticeId
	                },
	                datatype:"json",
	                xhrFields: {withCredentials: true},
	                success:function(data){
	                    var data = JSON.parse(data);
	                    _this.data =data;
	                    //data.noticeVo.context=util.removeHTMLTag(data.noticeVo.context);
	                },
	                error:function(data){

	                }
	            });
	       },
	      
		
	    }
	});
}