/**
 * Created by Lee on 2017/5/18.
 */
var vm = new Vue({
    el:"#orderDetail",
    data:{
        orderData:[],
        urlParm:util.hrefSplit(window.location.href)
    },
    created:function(){
        var self =this;
        $.ajax({
            type:"post",
            url:Helper.basePath + 'order/detail.htm',
            async:false,
            data:{
                id:self.urlParm.id
            },
            datatype:"json",
            xhrFields: {withCredentials: true},
            success:function(data){
                var _data = JSON.parse(data);
                self.orderData=_data;
            },
            error:function(data){

            }
        });
    },
    methods:{
        bntTrue:function(){
            var cthis =this;
            $.ajax({
                type:"post",
                url:Helper.basePath + 'order/updateStatus.htm',
                async:false,
                data:{
                    id:cthis.urlParm.id
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
                    window.location.href='/src/article/integral/my_order.html';
                },
                error:function(data){

                }
            });
        }
    }
})