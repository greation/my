/**
 * Created by Lee on 2017/5/18.
 */
var iv={}
iv.result=function(){
    var vm = new Vue({
    el:"#result",
    data:{
    	data:{
    		banner:{
    			linkUrl:''
    		}
    	}
    },
    created:function(){
    	var _this=this;
      $.ajax({
				url: Helper.basePath+'/investInfo/getInvestSuccessAd.htm',
				type: 'POST',
				dataType: 'json',
				data:"",
				xhrFields: {
					withCredentials: true
				}
			}).done(function(data){
				var data = JSON.parse(data);
				_this.data=data;
				
				
			})
    },
    methods:{
        goInvest:function(){
            if(util.getUrlParam('app') == 'IPHONE'){
            	window.webkit.messageHandlers.goInvest.postMessage('');
            }else if(util.getUrlParam('app') == 'ANDROID'){
                android.goInvest()
            }else{
                window.location.href='/src/invest/list.html';
            }
        },

        goInvest_two:function(){
            if(util.getUrlParam('app') == 'IPHONE'){
            	window.webkit.messageHandlers.goMyCenter.postMessage('');
            }else if(util.getUrlParam('app') == 'ANDROID'){
                android.goMyCenter()
            }else{
                window.location.href='/src/account/my_invest.html';
            }
        },
        gobanner:function(){
        	var _this=this;
        	var nowurl=document.URL;
				nowurl=location.href;
        	if(util.getUrlParam('app') == 'IPHONE'){
            	window.location.href=_this.data.banner.linkUrl+"&app=IPHONE"+"&title=no"+"&userId="+util.hrefSplit(nowurl).userId;
            }else if(util.getUrlParam('app') == 'ANDROID'){
                window.location.href=_this.data.banner.linkUrl+"&app=ANDROID"+"&title=no"+"&userId="+util.hrefSplit(nowurl).userId;
            }else{
                window.location.href=_this.data.banner.linkUrl;
            }
        }
 
    }
})


}