/**
 * Created by Lee on 2017/5/18.
 */

var vm = new Vue({
    el:"#integral",
    data:{
        integralData:[],
        banData:[],
        divLen:'',
        data:'',
        integral:'',
        likeData:[]
    },
     created:function(){
        var self = this;
        $.ajax({
            url: Helper.basePath+'article/getBanner.htm',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            async:false,
            data:{
                articleTypeCode:'CUUOAO'
            }
        })
        .done(function(data) {
            var data = JSON.parse(data);
            self.banData = data.bannerList;
            /*if(data.isLogin==='N'){
                window.location.href = Helper.webPath+'src/base/login.html';
            }else{
                
            }*/
        })
        .fail(function() {
        });
         $.ajax({
             type:"post",
             url:Helper.basePath + 'goods/index.htm',
             async:false,
             data:"",
             datatype:"json",
             xhrFields: {withCredentials: true},
             success:function(data){
                 var _data = JSON.parse(data);
				 self.data=_data;
                 self.integralData=_data.list;
                 self.divLen =_data.list.length/2;
                 self.likeData =_data.list2;
             },
             error:function(data){

             }
         });

     }
 })