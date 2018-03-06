var vms={};
vms.investing=function(){
	new Vue({
	el:"#investh",
	data:{
		money:'',
		isXieYi:false,
		yuqiGet:'',
		integralGet:'',
		incMoney:'',
		userInfo:'',
		raiseMoney:'',
		remayMoney:'',
		minInvest:'',
		maxInvest:'',
		durType:'',
		borrowDuration:'',
		baseMoney:'',
		borrowId:'',
		borrowType:'',
		voucherId:''
	},
	mounted:function(){
		var _this=this;
		
		var nowurl = window.location.href;
			nowurl=encodeURI(nowurl);
		
		var cardMo=util.getRequest(nowurl,"cardMo");
		var integralGet=this.money*_this.data.borrow.borrowDuration/12;
			this.integralGet=parseInt(integralGet)+'个';
			$("#integralGet").text(parseInt(integralGet)+'个');
			var moneyyb=$("#moneyyb").html();
			if(moneyyb){
					if(_this.durType=="MONTH"){
					var integralGet=moneyyb*this.borrowDuration/12;
					this.integralGet=parseInt(integralGet)+'个';
					$("#integralGet").html(this.integralGet);
					
				}
			}
	},
	created:function(){
		var _this=this;
		this.getData();
		var isSelectCoupon = util.getRequest(window.location.href,"voucherId");
		var nowurl = window.location.href;
				nowurl=encodeURI(nowurl);
		_this.voucherId = util.getRequest(nowurl,"voucherId");
		var cardMo=util.getRequest(nowurl,"cardMo");
		var investMoney=util.getRequest(nowurl,"investMoney");
		if(!isSelectCoupon){
			this.money = this.minInvest;
		}else{
			this.money = parseFloat(investMoney);
			if(cardMo.indexOf("%")>-1){
				$("#voucherId").text(cardMo + " 加息券");
			}else{
				cardMo=	parseFloat(cardMo);
				$("#voucherId").text(cardMo + " 元现金券");
			}
			$("#voucherId").attr("data-id",voucherId);
		}
		_this.cout();
		$.ajax({
				url: Helper.basePath+'member/getUser.htm',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			}).done(function(data){
				var data = JSON.parse(data);
				_this.userInfo = data.userInfo;
			})
	},
	methods:{
		getData:function(){
			var _this=this;
			var nowurl = window.location.href;
			nowurl=encodeURI(nowurl);
			var borrowId=util.getRequest(nowurl,"borrowId");
			_this.borrowId=borrowId;
			$.ajax({
				type:"post",
				url:Helper.basePath + 'borrowInfo/detail.htm',
				async:false,
				dataType:"json",
				data:{borrowId:borrowId},
				xhrFields: {withCredentials: true},
				success:function(data){
					var data=JSON.parse(data);
					_this.data=data;
					_this.incMoney=data.borrow.incMoney/100;
					_this.raiseMoney=(data.account.baseMoney-data.account.freezeMoney)/100;
					_this.remayMoney=(data.borrow.borrowMoney-data.borrow.raiseMoney)/100;
					_this.minInvest=data.borrow.minInvest/100;
					_this.maxInvest=data.borrow.maxInvest/100;
					_this.durType=data.borrow.durType;
					_this.borrowDuration=data.borrow.borrowDuration;
					_this.baseMoney=data.borrow.baseMoney;
					_this.borrowType=data.borrow.borrowType;
					if(_this.borrowType === 'GYHOUSE' || _this.borrowType === 'MAKE'){
						document.title = '房月盈'
						$('header .title').text('房月盈');
					}else if(_this.borrowType === 'GYCAR' || _this.borrowType === 'MAKECAR'){
						document.title = '车满盈';
						$('header .title').text('车满盈');
					}else{
						document.title = '新手标';
						$('header .title').text('新手标');
					}
				}
				
				
			});
		},
		allIn:function(){
			var _this=this;

			if(_this.borrowType=='MAKECAR'||_this.borrowType=='MAKE'){//预约标的 限制选择金额
				util.toast('预约专享标金额已确定，不能更改');
				return false;
			}

			if(this.userInfo.realName===null){
	      		util.confirm('是否先实名认证!',function(){
	        	util.baseLink('/src/base/real_name.html',0);
	      		});
	      		return false;
	    	}
			//可用余额
			var raiseMoney=_this.raiseMoney;
			//剩余可投
			var remayMoney=_this.remayMoney;
			//标的最大限额
			var maxInvest =_this.maxInvest;
			//标的最小限额
			var minInvest =_this.minInvest;
			var money=this.money*1;
			var incMoney=_this.incMoney*1;//增量
			var x=parseInt((raiseMoney-minInvest)/incMoney);//减去起投金额，除以增量
			var y=parseInt((maxInvest-minInvest)/incMoney);
			var z=parseInt((remayMoney-minInvest)/incMoney);
			var a=Math.min(x,y,z);
//			_this.money=a*incMoney +minInvest;
			_this.money = (a*incMoney + minInvest);
			
//			this.money=a*incMoney +minInvest;
			this.cout();
		},
		moneyadd:function(){
			var _this=this;
			var minInvest=_this.minInvest;//最小投资金额
			var maxInvest=_this.maxInvest;//最大投资金额
			var incMoney=_this.incMoney*1;//投资增量
			var money=_this.money;
			$("#voucherId").text('>');
			_this.voucherId = '';
			//voucherId = undefined;
			//way1
			if(_this.borrowType=='MAKECAR'||_this.borrowType=='MAKE'){//预约标的 限制选择金额
				util.toast('预约专享标金额已确定，不能更改');
				return false;
			}
			if(minInvest&&_this.money<minInvest){
				_this.money = _this.minInvest;
				
				//$("#money").val(parseInt(minInvest));
			}else{
				//此处调用时money的数据类型会改变，需要转换下
				_this.money =parseInt(incMoney)+parseInt(money);
//				_this.money =_this.money+ _this.incMoney;
			}
			//way2
//			if(money && minInvest){
//				this.money += incMoney;
//			}else{
//				this.money += minInvest;
//			}

			this.cout();
			
		},
		moneyminus:function(){
			var _this=this;
			var minInvest=_this.minInvest;//最小投资金额
			var maxInvest=_this.maxInvest;//最大投资金额
			var incMoney=_this.incMoney*1;//投资增量
			$("#voucherId").text('>');
			_this.voucherId = '';

			if(_this.borrowType=='MAKECAR'||_this.borrowType=='MAKE'){//预约标的 限制选择金额
				util.toast('预约专享标金额已确定，不能更改');
				return false;
			}

			if(_this.money-_this.incMoney<=0){
				util.toast('投资金额必须为正整数!');
				return;
			}else{
				//$("#money").val(parseInt(money)-parseInt(incMoney));
				_this.money = _this.money - _this.incMoney;
			}
			var re = /^[1-9]\d*$/;
			if (!re.test(_this.money)) {
				_this.money=minInvest;
        return;
	    }
			this.cout();
		},
		inputMony:function(){
			var _this=this;
			$("#money").focus(_this.cout());
		},
		//计算
		cout:function(){
			var _this=this;
			if(_this.data.borrow.borrowType==="MAKE" || _this.data.borrow.borrowType==="MAKECAR"){
			var money=_this.data.borrow.minInvest/100;
			var nowurl = window.location.href;
					nowurl=encodeURI(nowurl);
			var voucherId=util.getRequest(nowurl,"voucherId");
			var borrowId=util.getRequest(nowurl,"borrowId");
			$.ajax({
				type:"post",
				url:Helper.basePath+"borrowInfo/incomeMoney.htm",
				async:false,
				dataType:"json",
				xhrFields: {withCredentials: true},
				data:{
					money:money,	
					borrowId:borrowId,
					voucherId:_this.voucherId
				},
				success:function(data){
					//var yuqiGet1=data-money;
					//截取两位小数
					//var yuqiGet=parseInt(yuqiGet1*Math.pow(10,2)+0,10)/Math.pow(10,2);
					$("#yuqiGet").html(data+'元');
					var integralGet=_this.money * _this.data.borrow.borrowDuration/12;
					_this.integralGet = parseInt(integralGet)+'个';
					$("#integralGet").text(parseInt(integralGet)+'个');
				}
				
			});
			
			}else{
				//可用余额
			var raiseMoney=_this.raiseMoney;
			//剩余可投
			var remayMoney=_this.remayMoney;
			//标的最大限额
			var maxInvest =_this.maxInvest;
			//标的最小限额
			var minInvest =_this.minInvest;

			var incMoney=_this.incMoney*1;
			//判断
			if(this.money===null||this.money==""){
				this.money=minInvest;return;
			}
			
			if(isNaN(this.money)){
				util.toast('投资金额必须为数字!');
				return;
			}
			var re =/^[1-9]\d*$/;
			if(!re.test(this.money)){
				this.money=minInvest;
				util.toast('投资金额必须为正整数!');
				return;
			}
			if(raiseMoney){
				raiseMoney=raiseMoney;
			}else{
				raiseMoney=0;
			}
			
			if(raiseMoney!=null&&parseFloat(raiseMoney)<this.money){
				util.toast('账户余额不足，请充值');
		    	return;
			}
			if(this.money>remayMoney){
				 util.toast('投资金额不得大于剩余可投金额');
		        return;
			}
			if(this.money<minInvest){
				util.toast("投资金额不能小于最小起投金额"+parseInt(minInvest)+"元");
		        return;
			}
			if(maxInvest<this.money){
				util.toast("投资金额不能大于最大可投金额"+parseInt(maxInvest)+"元");
		        return;
			}
			if((this.money-minInvest)%incMoney!=0){
				util.toast("增量金额必须为:"+incMoney+"的整数倍");
		        return;
			}
			var nowurl = window.location.href;
					nowurl=encodeURI(nowurl);
			var borrowId=util.getRequest(nowurl,"borrowId");
			$.ajax({
				type:"post",
				url:Helper.basePath+"borrowInfo/incomeMoney.htm",
				async:false,
				dataType:"json",
				xhrFields: {withCredentials: true},
				data:{
					money:_this.money,	
					borrowId:borrowId,
					voucherId:_this.voucherId
				},
				success:function(data){
					//var yuqiGet1=(parseFloat(data)-_this.money);
					//截取两位小数
					//var yuqiGet1=parseInt(yuqiGet1*Math.pow(10,2)+0,10)/Math.pow(10,2);
					$("#yuqiGet").html(data+'元');
					var integralGet = _this.money * _this.data.borrow.borrowDuration/12;
					_this.integralGet = parseInt(integralGet)+'个';
					$("#integralGet").text(parseInt(integralGet)+'个');
				}
				
			});
			

			}
		},
		carDto :function(borrowId,investMoney){
			var _this=this;
			var nowurl = window.location.href;
			nowurl=encodeURI(nowurl);
			var borrowId=util.getRequest(nowurl,"borrowId");
			if(_this.data.borrow.borrowType==="MAKE" || _this.data.borrow.borrowType==="MAKECAR"){
				var investMoney=$("#moneyyb").html();
			}else{
				 var investMoney=$("#money").val();
			}
			$.ajax({
				type:"post",
				url:Helper.basePath + 'member/isLogin.htm',
				async:false,
				dataType:"json",
				xhrFields: {withCredentials: true},
				success:function(loginData){
					loginData=JSON.parse(loginData);
					if(loginData.isLogin=='N'){
						//判断体验金券
							window.location.href="/src/base/login.html?bUrl=/src/invest/xz_card.html&borrowId=" +borrowId+"&investMoney="+investMoney;
					}else{
						//判断体验金券
							window.location.href="xz_card.html?borrowId=" +borrowId+"&investMoney="+investMoney;
						}
				},
				error:function(loginData){
					
				}
			});	
		
		},
		rightInvest:function(borrowId){
					//判断是否选择协议
					var _this =this;
					//可用余额
					var nowurl = window.location.href;
					nowurl=encodeURI(nowurl);
					var borrowId=util.getRequest(nowurl,"borrowId");
					var voucherId=util.getRequest(nowurl,"voucherId");
//					alert(voucherId);
					var raiseMoney=(_this.baseMoney-_this.freezeMoney)/100;
					if(_this.data.borrow.borrowType==="MAKE" || _this.data.borrow.borrowType==="MAKECAR"){
						var investMoney=$("#moneyyb").html();
					}else{
						var investMoney=$("#money").val();
					}
					var nowurl = window.location.href;
					nowurl=encodeURI(nowurl);
					var voucherId=util.getRequest(nowurl,"voucherId");
					if(raiseMoney<100){
						util.toast('账户余额不足，请充值');
					}
					if(investMoney === ""){
						util.toast('请输入投资金额');
					}
					if(!this.isXieYi){
							util.toast('请阅读并同意投资协议');
						}else{
						if(_this.data.borrow.borrowType==="MAKE" || _this.data.borrow.borrowType==="MAKECAR"){
							var investMoney=$("#moneyyb").html();
						}else{
							 var investMoney=$("#money").val();
						}
						// var voucherId= $("#voucherId").data("id");
						var token = $("#token").val();
						var version=navigator.appVersion;
						$.ajax({
							type:"post",
							url:Helper.basePath + 'investInfo/doInvest.htm',
							async:false,
							data:{
								borrowInfoId:borrowId,
								investMoney:investMoney,
								voucherId:voucherId,
								CLIENT_TOKEN_NAME:token,
								retUrl:Helper.webPath+'/src/base/loading.html',
								userAgent:version,
								'token_id':tokenId
							},
							datatype:"json",
							xhrFields: {withCredentials: true},
							success:function(data){
								//_this.data=data;
								if(data.code==='325'){
									//重复提交投资信息
									util.toast(data.message);
						  		}else if(data.code==='7008'){
						  			util.alert('您的账户当前存在投资风险，平台为了营造安全的投资环境，暂时限制您的操作，建议您咨询客服。');
						  		}
								if(data.code !='000'){
									setTimeout(function(){
										if(data.code==='60020104'){
											util.toast("请先实名认证，正在为您跳转");
                                            util.baseLink('/src/base/real_name.html',2000);
										}else{
                                            util.toast(data.message);
										}
									},1000);
								}else {
										if(data.returnObject) {//托管模式
											window.document.write(data.returnValue.orderFormContent);
										} else {//非托管模式
											if(data.displayMode){
												$('.order-cart-realname div span').html(data.returnValue.orderFormContent);
												$('.order-cart-realname').show(200);
											} 
											}
										}
									
								},
							error:function(data){
							}
							});	
						}
					
		},
		linkChargeWith:function(){
	    if(this.userInfo.realName===null){
	      util.confirm('是否先实名认证!',function(){
	        util.baseLink('/src/base/real_name.html',0);
	      });
	      return false;
	    }
	    if(this.userInfo.isSetPayPwd==='NO'){
	      util.toast('设置支付密码，正在跳转');
	      $.ajax({
	        url: Helper.basePath+'member/modifySinaPwd.htm',
	        type: 'POST',
	        dataType: 'json',
	        xhrFields: {
	          withCredentials: true
	        },
	        data: {'pwdTransType':'set_pay_password','retUrl':Helper.webPath+'/src/base/loading.html?type=setPayPsw&uid='+this.data.account.userId}
	      })
	      .done(function(data){
	        var data = JSON.parse(data);
	        if(data.code==='000'){
	          window.location.href=data.redirectUrl;
	        }
	      })
	      return false;
	    }
	    if(this.userInfo.isBindCard==='NO'){
	      util.toast('请先绑定银行卡，正在跳转');
	      util.baseLink('/src/account/bind_bank.html',2000);
	      return false;
	    }
	    window.location.href='/src/account/charge.html';
	  }
		
	
	}
	
	
	})
	}
