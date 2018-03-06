/**
 * Created by Lee on 2017/5/18.
 */
var vm = new Vue({
    el:"#myOrder",
    data:{
        listData:[],
        datas:'',
        odcls:'WAIT',
        urData:util.hrefSplit(window.location.href),        
        curPage:0,
        pageIndex:1,
        pageSize:10,
        loadTxt:'加载更多...',
    },
    created:function(){
        if(this.urData.goodtype){
            this.ajaxPost(this.urData.goodtype=='PHYSICALGOODS'?'WAIT':'SUCCESS');
        }else{
            this.ajaxPost('SHIPPED');
        }
    },
    methods:{
        ajaxPost:function(o){
            var ordThis =this;
            ordThis.odcls =o
            $.ajax({
                type:"post",
                url:Helper.basePath + 'order/index.htm',
                async:false,
                data:{
                    orderStatus:o,
                    pageIndex:ordThis.pageIndex,
                    pageSize:10
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
                    ordThis.datas =_data;
                    //alert(_data);
                    if(_data.isLogin==='Y'){
                        for(var i = 0;i<_data.list.length;i++){
                            ordThis.listData.push(_data.list[i]);
                        }
                        if(ordThis.pageIndex>=ordThis.datas.page.pageCount){
                            ordThis.loadTxt='没有更多的数据！';
                        }else{
                            ordThis.loadTxt='加载更多...';
                        }

                    }else{
                        window.location.href='/src/base/login.html?bUrl=/src/article/integral/my_order.html';
                    }
                },
                error:function(data){

                }
            });
        },
        orderNav:function(o){
            var _this =this;
            _this.listData =[];
            _this.pageIndex =1;
            _this.ajaxPost(o);
            _this.odcls =o
        },


        order_detail:function(ops){
           var _this=this;
           window.location.href="/src/article/integral/order_detail.html?id=" + ops;
        },


        confirm:function(ops){

            util.confirm('您确定收到宝贝了吗？',function(){
            var cthis =this;
            $.ajax({
                type:"post",
                url:Helper.basePath + 'order/updateStatus.htm',
                async:false,
                data:{
                    id:ops.id
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
                    //cthis.ajaxPost(cthis.odcls);
                    //util.toast('订单已完成');
                    util.baseLink('/src/article/integral/my_order.html?goodtype=VIRTUALGOODS',100);
                },
                error:function(data){

                }
            });
            })

        },
        loadMore:function(){
            var _moreThis =this;
            if(_moreThis.pageIndex<_moreThis.datas.page.pageCount){
                _moreThis.pageIndex+=1;
                _moreThis.ajaxPost();
            }
        }
    }
})