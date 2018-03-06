var vm = new Vue({
    el:"#order",
    data:{
    	data:"",
      orderData:[],
        urlData:util.hrefSplit(window.location.href),
        addressGetData:'',
        addressId:''
    },
    created:function(){
        var self =this;
        if(self.urlData.addressId==='undefinde'){
          // self.addressGet();
        }
       
        $.ajax({
            type:"post",
            url:Helper.basePath + 'goods/toexchenge.htm',
            async:false,
            data:{
                stockId:self.urlData.s,
                goodNum:self.urlData.u,
                addressId:self.urlData.addressId
            },
            datatype:"json",
            xhrFields: {withCredentials: true},
            success:function(data){
                var _data = JSON.parse(data);
//              self.data=_data;
                if(_data.isLogin==='Y'){
                  self.orderData=_data;
                  if(_data.address!==null){
                    self.addressGetData=_data.address;
                    self.addressId=_data.address.id;
                  }
                }else{
                  window.location.href='/src/base/login.html?bUrl=/src/article/integral/index.html';
                }

                ///article/integral/order.html?s='+self.urlData.s+'&u='+self.urlData.u+'&d=
            },
            error:function(data){

            }
        });
    },
    methods:{
        subtForm:function(){
        	var _fThis =this;
//      	if($('#message_txt').val()==""){
//      		util.toast('请填写备注！！');
//      		return false;
//      	}
         	$.ajax({
	            type:"post",
	            url:Helper.basePath + 'order/makeOrder.htm',
	            async:false,
	            data:{
	                stockId:_fThis.urlData.s,
	                buyNum:_fThis.urlData.u,
	                remark:$('#message_txt').val(),
	                addressId:this.addressGetData.id
	            },
	            datatype:"json",
	            xhrFields: {withCredentials: true},
	            success:function(data){
	                var _data = data;
	                if(_data.respCode==000){
	                	var oc =_fThis.orderData.goodsInfo.goodsType;
		                window.location.href='/src/article/integral/my_order.html?goodtype='+oc+'';
		            }else if(_data.respCode==999){
		            	util.toast(_data.respDesc);
		            }else if(_data.respCode==9999){
                        util.toast(_data.respDesc);
                    }else if(_data.respCode==6017){
		            	util.toast(_data.respDesc);
		            	window.location.href='/src/base/login.html';
		            }
	            },
	            error:function(data){

	            }
	        });
         },
        addres:function(){
         	var _this =this;
         	window.location.href='/src/account/address.html?s='+_this.urlData.s+'&u='+_this.urlData.u+'&type=integralEd&d='
        },
        addressGet: function(){
        	var _this =this;
        	$.ajax({
	            type:"post",
	            url:Helper.basePath + 'member/manageAddress.htm',
	            async:false,
	            datatype:"json",
	            xhrFields: {withCredentials: true},
	            success:function(data){
	                var _data = JSON.parse(data),
	                addressList =_data.addressList;
	                for(var i=0; i<addressList.length; i++){
	                	if(addressList[i].id==_this.urlData.addressId){
	                		_this.addressGetData =addressList[i];
	                	}
	                }
	            },
	            error:function(data){

	            }
	        });
        }
    }
})