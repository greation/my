//标题
Vue.directive('title', {
  inserted: function(el, binding) {
    document.title = el.innerText
    var label=document.getElementById("title_label")
    label.innerHTML=el.innerText
    label.setAttribute("class", "item title text_split"); 
    el.remove()
  }
})

var vm = new Vue({
	el:"#app_goods_detal",
	data:{
		detailData:[],
		shopNum:1,
        standardArr:[],
        newarrMosaic:'',
        zh:{
		    a:'',
            b:'',
            c:'',
            d:'',
            e:''
        },
        mrVal:[],
        stockPrices:[],
        popData:[],
        isClick:'',
        sourceForm:''
	},
    created:function(){
        var self =this;
        $.ajax({
            type:"post",
            url:Helper.basePath + 'goods/detail.htm',
            async:false,
            data:{
				id:self.getUrlParam('id')
			},
            datatype:"json",
            xhrFields: {withCredentials: true},
            success:function(data){
                var _data = JSON.parse(data);
                self.detailData=_data;
                self.popData =_data.goodsInfo;
                for(p in _data.standard){
                   self.mrVal.push(_data.standard[p][0]);
                   self.standardArr.push({
					   keys:p,
					   vals:_data.standard[p]
				   });
                }
                //设置默认值
                self.zh={
                    a:self.mrVal[0],
                    b:self.mrVal[1],
                    c:self.mrVal[2],
                    d:self.mrVal[3],
                    e:self.mrVal[4]
                }
                var minStockId = '';
                var minIntegral = 0;
                for(m in _data.stockPrices){
                   self.stockPrices.push({
                       keys:m,
                       vals:_data.stockPrices[m]
                   });
                }

                minIntegral = parseInt(self._data.stockPrices[0].vals.split('_')[0]);
                minStockId = self._data.stockPrices[0].vals.split('_')[2] + "";
                for(m in self._data.stockPrices){
                    var integral = parseInt(self._data.stockPrices[m].vals.split('_')[0]);
                    var saleNum = self._data.stockPrices[m].vals.split('_')[1];
                    var stockId = self._data.stockPrices[m].vals.split('_')[2];
                    if(saleNum > 0 && minIntegral > integral){
                        minIntegral = integral;
                        minStockId = stockId;
                    }
                }

                self.popData.stockId =minStockId;

                for(m in self._data.stockPrices){
                self.isClick = self.stockPrices[m].vals.split('_')[1];
                //alert(self.isClick);
                }
               
            },
            error:function(data){

            }
        });
    },
	methods:{
        getUrlParam:function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
		chooseGz:function(){
			$(".mask,.xzgg").hide();
		},
		choosePop:function(){
			$(".mask,.xzgg").show();
			$(function(){
				$('.gz_xz span').each(function(){
					
					$(this).click(function(){
						$(this).addClass('n_btn ');
						$(this).siblings('span').removeClass('n_btn').addClass('c_btn');
					})
				})
			})
		},
		minus:function(){
			var mthis =this;
			var num = $(".num_integral").val();
			num--;
			if(num > 0) {
				$(".num_integral").val(num);
                mthis.shopNum = num;
			}else if(num == 0){
                //util.toast("不能为0");
                mthis.shopNum = 1;
            }
		},
		plus:function(){
            var pthis =this;
			var num = $(".num_integral").val();
			num++;
			$(".num_integral").val(num);
            pthis.shopNum = num;
		},
        subtForm:function(){//提交

            var adthis =this;
            $.ajax({
                type:"post",
                url:Helper.basePath + 'goods/canExchange.htm',
                async:false,
                data:{
                    stockId:typeof(adthis.popData.stockId)=='undefined'?'':adthis.popData.stockId,
                    goodNum:adthis.shopNum
                },
                datatype:"json",
                xhrFields: {withCredentials: true},
                success:function(data){
                    var _data = JSON.parse(data);
					//alert(22222);

                    if(_data.code=="000"){
                        if(util.getUrlParam('app') == 'IPHONE'){
                        	//alert(11111);
                            window.webkit.messageHandlers.exchange.postMessage([adthis.popData.stockId,adthis.shopNum,adthis.detailData.goodsInfo.goodsType]);
                        }else if(util.getUrlParam('app') == 'ANDROID'){
                            android.exchange(adthis.popData.stockId,adthis.shopNum,adthis.detailData.goodsInfo.goodsType);
                        }else{
                            window.location.href='/src/article/integral/order.html?s='+adthis.popData.stockId+'&u='+adthis.shopNum+''
                        }
                    }else{
                        util.toast(_data.message);
                    }
                },
                error:function(data){

                }
            });
		},
        switchFun:function(ops,inx){//切换
            var sthis =this,
                stLen =sthis.standardArr.length;
            if(inx==0){
                sthis.zh.a=ops
            }
            if(inx==1){
                sthis.zh.b=ops
            }
            if(inx==2){
                sthis.zh.c=ops
            }
            if(inx==3){
                sthis.zh.d=ops
            }
            if(inx==4){
                sthis.zh.e=ops
            }

            //设置个数
            var news ='',
                vals ='';
            if(stLen==1){
                news =sthis.zh.a
            }else if(stLen==2){
                news =sthis.zh.a+'_'+sthis.zh.b
            }else if(stLen==3){
                news =sthis.zh.a+'_'+sthis.zh.b+'_'+sthis.zh.c
            }else if(stLen==4){
                news =sthis.zh.a+'_'+sthis.zh.b+'_'+sthis.zh.c+'_'+sthis.zh.d
            }else if(stLen==5){
                news =sthis.zh.a+'_'+sthis.zh.b+'_'+sthis.zh.c+'_'+sthis.zh.d+'_'+sthis.zh.e
            }

            for(var i=0;i<sthis.stockPrices.length;i++){
                if(news==sthis.stockPrices[i].keys){
                    vals =sthis.stockPrices[i].vals;
                }
            }
            sthis.popData ={
                goodsName:sthis.popData.goodsName,
                integral:vals.split('_')[0],
                settlementPrice:vals.split('_')[3]==""?'0.0':vals.split('_')[3],
                exchangeAmount:sthis.popData.exchangeAmount,
                stockId:vals.split('_')[2]
            }
            sthis.newarrMosaic =1;
            sthis.isClick =vals.split('_')[1]
        }
	}
});
























































































