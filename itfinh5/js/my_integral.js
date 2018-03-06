var vm = new Vue({
    el:"#integral",
    data:{
        datas:'',
        integralData:[],
        loadTxt:'',
        curPage:0,
        pageIndex:1,
        pageSize:10,
        loadTxt:'加载更多...',
    },
    created:function(){
        var self =this;
        self.getData();
    },
    methods:{
        loadMore:function(){
            var _moreThis =this;
            if(_moreThis.pageIndex<_moreThis.datas.page.pageCount){
                _moreThis.pageIndex+=1;
                _moreThis.getData();
            }
        },
        getData:function(){
            var _this =this;
            $.ajax({
                type:"post",
                url:Helper.basePath + 'goods/intergalRecord.htm',
                async:false,
                data:{
                    pageIndex:_this.pageIndex,
                    pageSize:10
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
                        _this.datas =_data;
                    if(_data.isLogin==="Y"){
                        if(_data.list!==null){
                            for(var i = 0;i<_data.list.length;i++){
                                _this.integralData.push(_data.list[i]);
                            }
                            if(_this.pageIndex>=_this.datas.page.pageCount){
                                _this.loadTxt='没有更多的数据！';
                            }
                        }else{
                           _this.loadTxt='没有更多的数据！'; 
                        }
                    }else{
                        window.location.href='/src/base/login.html?bUrl=/src/article/integral/my_integral.html';
                    }
                },
                error:function(data){

                }
            });
        }
    }
})