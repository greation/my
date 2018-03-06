/**
 * Created by Lee on 2017/5/18.
 */
var vm = new Vue({
    el:"#list",
    data:{
        datas:'',
        listData:[],
        cls:'',
        curPage:0,
        pageIndex:1,
        pageSize:10,
        loadTxt:'加载更多...',
        urParm:util.hrefSplit(window.location.href)
    },
    created:function(){

        var self =this;
        if(self.urParm){
            self.getListData(self.urParm.categoryCode);
            self.cls =self.urParm.categoryCode;
        }else{
            self.getListData('');
        }
    },
    methods:{
        urlId:function(id){
        window.location.href='/src/article/integral/goods_detail.html?id='+id+''
        },

        tabNav:function(o){
            var tabThis =this;
            tabThis.listData =[];
            tabThis.pageIndex =1;
            tabThis.getListData(o);
            tabThis.cls =o;
        },
        getListData:function(p){
            var _this =this;
            $.ajax({
                type:"get",
                url:Helper.basePath + 'goods/list.htm',
                async:false,
                data:{
                    categoryCode:p,
                    pageIndex:_this.pageIndex,
                    pageSize:10
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
                        _this.datas =_data;
                    for(var i = 0;i<_data.list.length;i++){
                        _this.listData.push(_data.list[i]);
                    }
                    if(_this.pageIndex>=_this.datas.page.pageCount){
                        _this.loadTxt='没有更多的数据！';
                    }else{
                        _this.loadTxt='加载更多...';
                    }
                },
                error:function(data){

                }
            });
        },
        loadMore:function(){
            var _moreThis =this;
            if(_moreThis.pageIndex<_moreThis.datas.page.pageCount){
                _moreThis.pageIndex+=1;
                _moreThis.getListData();
            }
        }
    }
})