//creat by gannicus on 2017/4/22
var iv = {}
iv.invest = function (obj) {
	//投资列表
	var vm = new Vue({
		el: "#appList",
		data: {
			data: "",
			list: [],
			pageIndex: 1,
			pageSize: 10,
			curStatus: null,
			blockArr: [true, false, false],
			loadTxt: '加载更多...',
			isinp: false,
			curnum: '',
			pwdYb: '',
			YborrowId: '',
			sortType: 0,
			sortRule: 1//约标的id
		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed() + '元'
				return value
			},
			capitalizeb: function (value) {
				if (!value) return ''
				value = value + '%'
				return value
			},
			capitalizeg: function (value) {
				if (!value) return ''
				value = value.toFixed(1)
				return value
			},
			capitalizeq: function (value) {
				var value = (value || 0).toString(), value2 = "", result = '';
				if (value.indexOf(".") != -1) {
					nums = value.split(".");
					value = nums[0];
					value2 = "." + nums[1];
				}
				while (value.length > 3) {
					result = ',' + value.slice(-3) + result;
					value = value.slice(0, value.length - 3);
				}
				if (value) { result = value + result + value2; }
				return result;
			}
		},
		created: function () {
			var _this = this;
			this.getInvestData();
		},
		methods: {
			getInvestData: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var voucherId = util.getRequest(nowurl, "voucherId");
				if(!util.isEmpty(voucherId)){
					$('header .title').text('投资列表').next().text('');
					$('.nav_list').hide();
				}
				$.ajax({
					url: Helper.basePath + 'borrowInfo/list.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						sortType: this.sortType,
						sortRule: this.sortRule,
						voucherId: voucherId,
						borrowType: obj.borrowType
					}
				})
					.done(function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.isLogin === 'N') {
							util.toast('请登录');
							window.location.href = '/src/base/login.html';
						} else {
							for (var i = 0; i < data.listBorrow.length; i++) {
								_this.list.push(data.listBorrow[i]);
							}
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
							}
							if (_this.pageIndex >= _this.data.page.pageCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
						}

						//					//标的类型为尊享约标MAKE
						//					if(data.listBorrow.borrowType==='MAKE'){
						//						this.ybPwd();
						//					}

					})
					.fail(function () {
					})
			},
			loadMore: function () {
				var _this = this;
				if (this.pageIndex++ < this.data.page.totalCount) {
					this.getInvestData();
				}
			},
			projectLink: function (borrowId, borrowType) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						data = JSON.parse(data);
						if (data.isLogin == 'N') {
							util.baseLink('/src/base/login.html?bUrl=/src/index/index.html', 1000);
							//							window.location.href="/src/base/login.html?bUrl=/src/invest/project_home.html&borrowId=" + borrowId;
						} else {
							//在此判断跳转体验金标和普通标
							if (borrowType === 'MAKE' || borrowType === 'MAKECAR') {
								_this.YborrowId = borrowId;
								$(".modal-bg").show();
								$(".yb-psw").show();
							} else if (borrowType === 'EXPERIENCE') {
								//体验金标
								window.location.href = "project_detail.html?borrowId=" + borrowId + '&source=list';
							} else {
								//普通标
								window.location.href = "project_home.html?borrowId=" + borrowId + '&source=list';
							}

						}
					},
					error: function (data) {

					}
				});
			},
			//0,1,2,3依次排列的四种状态，综合排序，利率，期限，进度
			//排序的，升序1，不排序0，降序-1
			commenRank: function () {
				var _this = this;
				$.ajax({
					url: Helper.basePath + 'borrowInfo/list.htm',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						sortType: 0,
						sortRule: 1,
						borrowType: obj.borrowType
					}
				})
					.done(function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.list = [];
						$(".zh").removeClass("c9").addClass("cblue");
						$(".ly").removeClass("cblue").addClass("c9").find("i").removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
						for (var i = 0; i < data.listBorrow.length; i++) {
							_this.list.push(data.listBorrow[i]);
						}
					})


			},
			rateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: this.sortType,
							sortRule: this.sortRule,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								_this.list.push(data.listBorrow[i]);
							}

						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 1;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: this.sortType,
							sortRule: this.sortRule,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".ly").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}

						})
				}

			},
			dateRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 2;
					this.pageIndex = 1;

					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: 2,
							sortRule: rank,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 2;

					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: this.sortType,
							sortRule: this.sortRule,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".qx").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".jd").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				}

			},
			progressRank: function () {
				var _this = this;
				var rank = "";
				this.isinp = !this.isinp;
				if (!this.isinp) {
					rank = 1;
					_this.sortRule = 1;
					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: this.sortType,
							sortRule: rank,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								sortRule = rank;
								_this.list.push(data.listBorrow[i]);
							}
						})
				} else {
					rank = -1;
					_this.sortRule = -1;
					this.sortRule = rank;
					this.sortType = 3;
					this.pageIndex = 1;
					$.ajax({
						url: Helper.basePath + 'borrowInfo/list.htm',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							sortType: this.sortType,
							sortRule: this.sortRule,
							borrowType: obj.borrowType
						}
					})
						.done(function (data) {
							var data = JSON.parse(data);
							_this.data = data;
							if (_this.pageIndex >= 10) {
								$(".look_more").show();
								$(".btn_load_more").hide();
							}
							if (_this.pageIndex < 10) {
								$(".look_more").hide();
								$(".btn_load_more").show();
							}
							if (_this.pageIndex >= _this.data.page.totalCount) {
								_this.loadTxt = '没有更多的数据！';
							}
							if (_this.voucherId == "") {
								_this.loadTxt = '没有更多的数据！';
							}
							_this.list = [];
							$(".jd").removeClass("c9").addClass("cblue").find("i").removeClass("px_icon").addClass("px_ic").toggleClass("px_iconz");
							$(".zh").removeClass("cblue").addClass("c9");
							$(".ly").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							$(".qx").removeClass("cblue").addClass("c9").find('i').removeClass("px_ic").addClass("px_icon").removeClass("px_iconz");
							for (var i = 0; i < data.listBorrow.length; i++) {
								_this.list.push(data.listBorrow[i]);
							}
						})
				}

			},
			yb: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/deal.html";
						} else {
							//在此判断跳转体验金标和普通标
							window.location.href = "deal.html";
						}
					},
					error: function (loginData) {

					}
				});
			},
			//约标密码
			//约标输入
			inputPwd: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;

			},

			pwdIn: function () {
				var _this = this;
				var isinp = _this.isinp;
				var curnum = _this.curnum;
				curnum = 0;
				$('.ipswbox').click(function () {
					$(this).css('border', '#00a0ea 1px solid');
					$('.pswbtn').focus();
					isinp = true;
				})
				$('.pswbtn').keyup(function (event) {

					if (curnum >= 6 || curnum < 0) {
						isinp = false;
					}
					if (isinp) {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
						} else {
							if (event.keyCode != 8) {
								$('.ipswbox i').eq(curnum).addClass('active');
								curnum += 1;
							}
						}
					} else {
						if (event.keyCode == 8 && curnum > 0) {
							curnum -= 1;
							$('.ipswbox i').eq(curnum).removeClass('active');
							isinp = true;
						}
					}
				})
				$('.pswbtn').blur(function () {
					isinp = false;
					$('.ipswbox').css('border', '#fff 1px solid');
				})
			},
			//约标确认和取消
			pswCancle: function () {
				var _this = this;
				_this.curnum = 0;
				$(".modal-bg").hide();
				$(".yb-psw").hide();
				$(".ipswbox i").removeClass('active');
				_this.pwdYb = "";
				$("#message").hide();
			},
			pswSure: function () {
				var _this = this;
				$("#message").hide();
				var pwd = $("#pswbtn").val();
				var id = _this.YborrowId;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/checkpwd.htm',
					async: true,
					datatype: "json",
					data: {
						id: id,
						pwd: pwd
					},
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code == '001') {
							$("#message").show();
						}
						if (data.code == '000') {
							$(".ipswbox i").removeClass('active');
							//util.toast(data.message);
							window.location.href = "project_home.html?borrowId=" + id;
						}

					},
					error: function (data) {

					}
				});

			}
		}
	});
}
//约标
iv.car = function () {
	var vm = new Vue({
		el: "#caculate",
		data: {
			data: '',
			items: [],
			deList: [],
			moneyList: [],
			typeB: '',
			typeQ: '',
			typeM: ''
		},
		created: function () {
			var _this = this;
			this.ybType();
			this.getType();
		},
		mounted: function () {
			var _this = this;
			this.typeB = _this.items[0].makeTypeIdStr;
			this.typeQ = _this.deList[0].idStr;
			this.typeM = _this.moneyList[0].idStr;
		},
		methods: {
			//约标类型
			ybType: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findTypeList.htm",
					async: false,
					dataType: "json",
					xhrFields: { withCredentials: true },
					data: {
						type: util.hrefSplit(window.location.href).type
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.items = _this.data.makeBorrowTypeList;
						_this.typeB = _this.items[0].makeTypeIdStr;
					},
					error: function (data) {

					}
				});
			},
			//收益期限
			getType: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findList.htm",
					async: false,
					dataType: "json",
					data: {
						typeId: this.typeB
					},
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.deList = _this.data.deList;
						_this.moneyList = _this.data.moneyList;
						_this.typeQ = _this.deList[0].idStr;
						_this.typeM = _this.moneyList[0].idStr;
					},
					error: function (data) {

					}
				});
			},
			//计算
			caculate: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/calculate.htm",
					async: false,
					dataType: "json",
					data: {
						deId: _this.typeQ,
						moneyId: _this.typeM
					},
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code === '001') {
							util.toast(data.message);

							//							window.location.href="/src/account/charge.html" ;
						}
						util.toast(data.message);
					},
					error: function (data) {
						util.toast(data.message);
					}
				});
			},
			TypeC: function () {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/findList.htm",
					async: false,
					dataType: "json",
					xhrFields: { withCredentials: true },
					data: {
						typeId: _this.typeB
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						_this.deList = _this.data.deList;
						_this.moneyList = _this.data.moneyList;
						_this.typeQ = _this.deList[0].idStr;
						_this.typeM = _this.moneyList[0].idStr;
					},
					error: function (data) {

					}
				});
			},
			creatYb: function () {

				var _this = this;
				var timetext = $("#timetext").val();
				var remark = $("#remark").val();
				$.ajax({
					type: "post",
					url: Helper.basePath + "borrowInfo/create.htm",
					async: false,
					dataType: "json",
					xhrFields: { withCredentials: true },
					data: {
						typeId: _this.typeB,
						deId: _this.typeQ,
						moneyId: _this.typeM,
						timetext: timetext,
						remark: remark
					},
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.code === '002') {
							util.toast('约标成功！');
							util.baseLink('/src/invest/list.html', 1000);
						}
						if (data.code === '001') {
							util.toast(data.message);



						}

					},
					error: function (data) {

					}
				});
			}


		}
	});
}
//标的投资记录
iv.prorecord = function () {
	var vm = new Vue({
		el: "#iNrecord",
		data: {
			data: '',
			items: [],
			pageIndex: 1,
			pageSize: 10,
			loadTxt: '加载更多...',
			awardTemplateId: '',
			urlJson: util.hrefSplit(window.location.href)
		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed(2)
				return value
			},
		},
		created: function () {
			var _this = this;
			var nowurl = window.location.href;
			this.getList();
			var awardTemplateId = util.getRequest(nowurl, "awardTemplateId");
		},
		methods: {
			getList: function () {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/showBorrowInvest.htm',
					async: false,
					data: {
						borrowId: borrowId,
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
					},
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.isLogin === 'N') {
							util.toast('请登录');
							window.location.href = '/src/base/login.html';
						} else {
							for (var i = 0; i < data.list.length; i++) {
								_this.items.push(data.list[i]);
							}
						}
						if (_this.data.page.currentPage >= _this.data.page.pageCount) {
							_this.loadTxt = '没有更多的数据！';
						}
					},
					error: function (data) {

					}
				});
			},
			loadMore: function () {
				if (this.pageIndex++ < this.data.page.pageCount) {
					this.getList();
				}
			},
			ProLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				util.osTypeHandle({
					iphone:function(){
						window.location.href = "/src/invest/project.html?borrowId=" + borrowId +"&app=IPHONE&title=no&userId=" + _this.urlJson.userId;
					},
					android:function(){
						window.location.href = "/src/invest/project.html?borrowId=" + borrowId +"&app=ANDROID&title=no&userId=" + _this.urlJson.userId;
					},
					h5:function(){
						window.location.href = "/src/invest/project.html?borrowId=" + borrowId;
					}
				})
				
			},
			RecLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId;
			},
			HorLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/honor.html?borrowId=" + borrowId;
			},

			loadingMore: function () {
				if (!vm.$data.show_more) {
					return false;
				} else {
					vm.$data.show_more_text = '正在加载...';
					//执行callback

					vm.$data.currentPage++;
				}
			},

		}
	});
}

//标的详情
iv.bDetail = function () {
	//标的详情

	//标题
	Vue.directive('title', {
		inserted: function (el, binding) {
			document.title = el.innerText
			el.remove()
		}
	})

	var vm = new Vue({
		el: "#bdetail",
		data: {
			data: "",
			money: '100',
			isXieYi: false,
			yuqiGet: '',
			integralGet: '',
			investNumber: '',
			invesetCount: ''
		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed() + '元'
				return value
			},
			capitalizeb: function (value) {
				if (!value) return ''
				value = value + '%'
				return value
			},
			capitalizea: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed(0) + '元'
				return value
			},
			capitalizec: function (value) {
				if (!value) return ''
				value = value + '个'
				return value
			},
			capitalizeg: function (value) {
				if (!value) return ''
				value = value.toFixed(1)
				return value
			},
			capitalizeq: function (value) {
				var value = (value || 0).toString(), value2 = "", result = '';
				if (value.indexOf(".") != -1) {
					nums = value.split(".");
					value = nums[0];
					value2 = "." + nums[1];
				}
				while (value.length > 3) {
					result = ',' + value.slice(-3) + result;
					value = value.slice(0, value.length - 3);
				}
				if (value) { result = value + result + value2; }
				return result;
			}
		},
		created: function () {
			var _this = this;
			//页面数据
			this.getData();

		},
		mounted: function () {
			var _this = this;
			this.money = util.getRequest(window.location.href, "investMoney");
			//		var money=this.money;
			//		if(_this.data.borrow.durType==="YEAR"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/100;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}
			//		if(_this.data.borrow.durType==="QUARTER"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/1200;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}
			//		if(_this.data.borrow.durType==="MONTH"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/1200;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}

		},
		methods: {
			getData: function () {
				var _this = this;
				var nowurl = window.location.href;
				nowurl = encodeURI(nowurl);
				var borrowId = util.getRequest(nowurl, "borrowId");
				var pageSource = util.hrefSplit(location.href).source;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/detail.htm',
					async: false,
					data: {
						borrowId: borrowId
					},
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						var borrowType = '新手标';
						if (data.borrow.borrowType === 'GYHOUSE') {
							borrowType = '房月盈'
						}
						sa.track('product_view', {
							method_productsearch: pageSource === 'index' ? '首页' : pageSource === 'list' ? '列表' : '未知',
							product_id: data.borrow.borrowId,
							product_name: data.borrow.borrowName,
							product_type: borrowType,
							annualize_income: data.borrow.borrowRate + '%',
							investment_period: data.borrow.borrowDuration + '个月'
						})
						_this.data = data;
						_this.investNumber = data.investNumber;
						_this.invesetCount = data.invesetCount;
						var cardMo = util.getRequest(nowurl, "cardMo");
						//					var money=util.getRequest(nowurl,"investMoney");
						var voucherId = util.getRequest(nowurl, "voucherId");
						/*app 调用参数 */
						if (util.getUrlParam('app') == 'IPHONE') {
							window.webkit.messageHandlers.exchange.postMessage([_this.data.borrow.borrowId]);
						} else if (util.getUrlParam('app') == 'ANDROID') {
							//alert(_this.data.borrow.borrowId);
							android.exchange(_this.data.borrow.borrowId);
						} else {
							//window.location.href='/src/article/integral/order.html?s='+adthis.popData.stockId+'&u='+adthis.shopNum+''
						}
					},
					error: function (data) {

					}
				})
			},
			getMore: function (borrowId) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/project.html?borrowId=" + borrowId;
						} else {
							// if (_this.data.borrow.borrowType === 'GYCAR' || _this.data.borrow.borrowType === 'MAKECAR') {
							// 	window.location.href = "/src/invest/project_car.html?borrowId=" + borrowId;
							// } else {
								window.location.href = "/src/invest/project.html?borrowId=" + borrowId;
							//}
						}
					},
					error: function (loginData) {
					}
				});
			},


			closeOp: function () {
				$('#ljInevest').hide();
				$('.mask').hide();
			},
			btnLj: function (borrowId) {
				//			$("#ljInevest").show();
				//			$('.mask').show();
				var _this = this;
				if (_this.investNumber === _this.invesetCount) {
					util.confirm('操作异常！您频繁投资并未支付，今日您还有1次机会，否则账户将被冻结投资操作', function () {
						$.ajax({
							type: "post",
							url: Helper.basePath + 'member/isLogin.htm',
							async: false,
							datatype: "json",
							xhrFields: { withCredentials: true },
							success: function (loginData) {
								loginData = JSON.parse(loginData);
								if (loginData.isLogin == 'N') {
									window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId;
								} else {
									window.location.href = "investing.html?borrowId=" + borrowId;
								}
							},
							error: function (loginData) {

							}
						});
					});

				} else {
					$.ajax({
						type: "post",
						url: Helper.basePath + 'member/isLogin.htm',
						async: false,
						datatype: "json",
						xhrFields: { withCredentials: true },
						success: function (loginData) {
							loginData = JSON.parse(loginData);
							if (loginData.isLogin == 'N') {
								window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId;
							} else {
								window.location.href = "investing.html?borrowId=" + borrowId;
							}
						},
						error: function (loginData) {

						}
					});
				}



			}


		}
	});
}

//项目描述--老版
iv.proMS = function () {
	var vm = new Vue({
		el: "#proMS",
		data: {
			data: "",
			money: '100',
			isXieYi: false,
			yuqiGet: '',
			integralGet: '',
			investNumber: '',
			invesetCount: ''
		},
		filters: {
			capitalize: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed() + '元'
				return value
			},
			capitalizeb: function (value) {
				if (!value) return ''
				value = value + '%'
				return value
			},
			capitalizea: function (value) {
				if (!value) return ''
				value = value / 100
				value = value.toFixed(0) + '元'
				return value
			},
			capitalizec: function (value) {
				if (!value) return ''
				value = value + '个'
				return value
			},
			capitalizeg: function (value) {
				if (!value) return ''
				value = value.toFixed(1)
				return value
			},
			capitalizeq: function (value) {
				var value = (value || 0).toString(), value2 = "", result = '';
				if (value.indexOf(".") != -1) {
					nums = value.split(".");
					value = nums[0];
					value2 = "." + nums[1];
				}
				while (value.length > 3) {
					result = ',' + value.slice(-3) + result;
					value = value.slice(0, value.length - 3);
				}
				if (value) { result = value + result + value2; }
				return result;
			}
		},
		created: function () {
			var _this = this;
			//页面数据
			this.getData();


		},
		mounted: function () {
			var _this = this;
			this.money = util.getRequest(window.location.href, "investMoney");
			//		var money=this.money;
			//		if(_this.data.borrow.durType==="YEAR"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/100;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}
			//		if(_this.data.borrow.durType==="QUARTER"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/1200;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}
			//		if(_this.data.borrow.durType==="MONTH"){
			//			this.yuqiGet==(money*_this.data.borrow.borrowDuration *_this.data.borrow.borrowRate)/1200;
			//			this.yuqiGet= =yuqishouyi.toFixed(2);
			//			return this.yuqiGet;
			//		}

		},
		methods: {
			//神策
			saProductTab: function (tabtext) {
				var _this = this;
				var borrowType = '新手标';
				if (_this.data.borrow.borrowType === 'GYHOUSE') {
					borrowType = '房月盈'
				}
				sa.track('product_click', {
					product_id: _this.data.borrow.borrowId,
					product_name: _this.data.borrow.borrowName,
					product_type: borrowType,
					annualize_income: _this.data.borrow.borrowRate + '%',
					investment_period: _this.data.borrow.borrowDuration + '个月',
					producttab_click: tabtext
				})
			},
			ProLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/project.html?borrowId=" + borrowId;

			},
			RecLink: function (awardTemplateId) {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId + "&awardTemplateId=" + awardTemplateId;

			},
			HorLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/honor.html?borrowId=" + borrowId;

			},
			getData: function () {
				var _this = this;
				var nowurl = window.location.href;
				nowurl = encodeURI(nowurl);
				var borrowId = util.getRequest(nowurl, "borrowId");
				var pad = util.getRequest(nowurl, "pad");
				var jrdata;
				if (pad == "no") {
					jrdata = {
						borrowId: borrowId,
						pad: pad
					}
				} else {
					jrdata = {
						borrowId: borrowId
					}
				}
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/detail.htm',
					async: false,
					data: jrdata,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						data.borrow.productDesc = util.removeHTMLTag(_this.data.borrow.productDesc);
						data.borrow.borrowerDesc = util.removeHTMLTag(_this.data.borrow.borrowerDesc);
						_this.investNumber = data.investNumber;
						_this.invesetCount = data.invesetCount;
						var cardMo = util.getRequest(nowurl, "cardMo");
						//					var money=util.getRequest(nowurl,"investMoney");
						var voucherId = util.getRequest(nowurl, "voucherId");
						var yuqishouyi = $("#yuqishouyi").html();
						var getJf = $("#getJf").html();
						if (cardMo) {
							$("#ljInevest").show();
							$('.mask').show();
							money = _this.investMoney;
							if (cardMo.indexOf("%") > -1) {
								$("#voucherId").text(cardMo + " 加息券");
							} else {
								$("#voucherId").text(cardMo + " 元现金券");
							}
							$("#voucherId").attr("data-id", voucherId);
						}

						/*app 调用参数 */
						if (util.getUrlParam('app') == 'IPHONE') {
							window.webkit.messageHandlers.exchange.postMessage([_this.data.borrow.borrowId]);
						} else if (util.getUrlParam('app') == 'ANDROID') {
							//alert(_this.data.borrow.borrowId);
							android.exchange(_this.data.borrow.borrowId);
						} else {
							//window.location.href='/src/article/integral/order.html?s='+adthis.popData.stockId+'&u='+adthis.shopNum+''
						}


					},
					error: function (data) {

					}
				})
			},
			getMore: function (borrowId) {
				var _this = this;
				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (loginData) {
						loginData = JSON.parse(loginData);
						if (loginData.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/project.html?borrowId=" + borrowId;
						} else {
							window.location.href = "/src/invest/project.html?borrowId=" + borrowId;
						}
					},
					error: function (loginData) {

					}
				});
			},


			closeOp: function () {
				$('#ljInevest').hide();
				$('.mask').hide();
			},
			btnLj: function (borrowId) {
				//			$("#ljInevest").show();
				//			$('.mask').show();
				var _this = this;
				if (_this.investNumber === _this.invesetCount) {
					util.confirm('操作异常！您频繁投资并未支付，今日您还有1次机会，否则账户将被冻结投资操作', function () {
						$.ajax({
							type: "post",
							url: Helper.basePath + 'member/isLogin.htm',
							async: false,
							datatype: "json",
							xhrFields: { withCredentials: true },
							success: function (loginData) {
								loginData = JSON.parse(loginData);
								if (loginData.isLogin == 'N') {
									window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId;
								} else {
									window.location.href = "investing.html?borrowId=" + borrowId;
								}
							},
							error: function (loginData) {

							}
						});
					});

				} else {
					$.ajax({
						type: "post",
						url: Helper.basePath + 'member/isLogin.htm',
						async: false,
						datatype: "json",
						xhrFields: { withCredentials: true },
						success: function (loginData) {
							loginData = JSON.parse(loginData);
							if (loginData.isLogin == 'N') {
								window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId;
							} else {
								window.location.href = "investing.html?borrowId=" + borrowId;
							}
						},
						error: function (loginData) {

						}
					});
				}


			}

		}
	});
}
//项目描述-新版
iv.newPro = function () {
	var vm = new Vue({
		el: "#newPro",
		data: {
			data: "",
			urlJson: util.hrefSplit(window.location.href)
		},
		created: function () {
			var _this = this;
			//获取初始页面数据
			this.getData();
		},
		methods: {
			//神策
			saProductTab: function (tabtext) {
				var _this = this;
				var borrowType = '新手标';
				if (_this.data.borrow.borrowType === 'GYHOUSE' || _this.data.borrow.borrowType === 'MAKE') {
					borrowType = '房月盈';
				} else if (_this.data.borrow.borrowType === 'GYCAR' || _this.data.borrow.borrowType === 'MAKECAR') {
					borrowType = '车满盈';
				}
				sa.track('product_click', {
					product_id: _this.data.borrow.borrowId,
					product_name: _this.data.borrow.borrowName,
					product_type: borrowType,
					annualize_income: _this.data.borrow.borrowRate + '%',
					investment_period: _this.data.borrow.borrowDuration + '个月',
					producttab_click: tabtext
				})
			},
			ProLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/project.html?borrowId=" + borrowId;

			},
			RecLink: function (awardTemplateId) {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				util.osTypeHandle({
					iphone:function(){
						window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId + "&awardTemplateId=" + awardTemplateId + "&title=no&app=IPHONE&userId=" + _this.urlJson.userId;
					},
					android:function(){
						window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId + "&awardTemplateId=" + awardTemplateId + "&title=no&app=ANDROID&userId=" + _this.urlJson.userId;
					},
					h5:function(){
						window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId + "&awardTemplateId=" + awardTemplateId;
					}
				})
			},
			HorLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/honor.html?borrowId=" + borrowId;

			},
			getData: function () {
				var _this = this;
				var nowurl = window.location.href;
				nowurl = encodeURI(nowurl);
				var borrowId = util.getRequest(nowurl, "borrowId");
				var pad = util.getRequest(nowurl, "pad");
				var jrdata;
				if (pad == "no") {
					jrdata = {
						borrowId: borrowId,
						pad: pad,
						userId:_this.urlJson.userId
					}
				} else {
					jrdata = {
						borrowId: borrowId,
						userId:_this.urlJson.userId
					}
				}
				$.ajax({
					type: "post",
					url: Helper.basePath + 'borrowInfo/detail.htm',
					async: false,
					data: jrdata,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						var data = JSON.parse(data);
						_this.data = data;
						if (data.isLogin === 'N') {
							window.location.href = '/src/base/login.html?bUrl=/src/invest/project.html?borrowId=' + borrowId;
						}
					},
					error: function (data) {

					}
				})
			},
			//点击立即投资触发
			btnLj: function (borrowId) {
				var _this = this;
				if (_this.urlJson.app === 'ANDROID') {
					android.goBorrowInvest(_this.urlJson.borrowId);
				} else if (_this.urlJson.app === 'IPHONE') {
					window.webkit.messageHandlers.goBorrowInvest.postMessage(_this.urlJson.borrowId);
				} else {
					if (_this.data.investNumber === _this.data.invesetCount) {
						util.confirm('操作异常！您频繁投资并未支付，今日您还有1次机会，否则账户将被冻结投资操作', function () {
							$.ajax({
								type: "post",
								url: Helper.basePath + 'member/isLogin.htm',
								async: false,
								datatype: "json",
								xhrFields: { withCredentials: true },
								success: function (loginData) {
									loginData = JSON.parse(loginData);
									if (loginData.isLogin == 'N') {
										window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html?borrowId=" + borrowId;
									} else {
										window.location.href = "investing.html?borrowId=" + borrowId;
									}
								},
								error: function (loginData) {}
							});
						});
					} else {
						$.ajax({
							type: "post",
							url: Helper.basePath + 'member/isLogin.htm',
							async: false,
							datatype: "json",
							xhrFields: { withCredentials: true },
							success: function (loginData) {
								loginData = JSON.parse(loginData);
								if (loginData.isLogin == 'N') {
									window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html?borrowId=" + borrowId;
								} else {
									window.location.href = "investing.html?borrowId=" + borrowId;
								}
							},
							error: function (loginData) {}
						});
					}
				}
			},
			// 根据平台不懂，打开url不一样
			openUrl:function(url){
				util.osTypeHandle({
					iphone:function(){
						window.location.href = url+'?title=no';
					},
					android:function(){
						window.location.href = url+'?title=no';
					},
					h5:function(){
						window.location.href = url;
					}
				})
			},
			//去掉html标签
			removeHTMLTag:util.removeHTMLTag,
			//审核资料和其他资料超出长度以省略号代替
			strOverflow:util.strOverflow
		}
	});
}
iv.honor = function () {
	var vm = new Vue({
		el: "#honor",
		data: {
			data: ""
		},
		filters: {
		},
		created: function () {
			var _this = this;
			var nowurl = document.URL;
			nowurl = location.href;
			var borrowId = util.getRequest(nowurl, "borrowId");
			$.ajax({
				type: "post",
				url: Helper.basePath + 'borrowInfo/detail.htm',
				async: false,
				data: {
					borrowId: borrowId
				},
				datatype: "json",
				xhrFields: { withCredentials: true },
				success: function (data) {
					var data = JSON.parse(data);
					_this.data = data;



				},
				error: function (data) {

				}
			});

		},
		methods: {
			ProLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/project.html?borrowId=" + borrowId;
			},
			RecLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/invest_record.html?borrowId=" + borrowId;
			},
			HorLink: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				window.location.href = "/src/invest/honor.html?borrowId=" + borrowId;
			}

		}
	});
}
iv.xzcard = function () {
	//卡券选择
	var vm = new Vue({
		el: "#xzCard",
		data: {
			data: '',
			expresscard: []
		},
		created: function () {
			var _this = this;
			var nowurl = document.URL;
			nowurl = location.href;
			var borrowId = util.getRequest(nowurl, "borrowId");
			var investMoney = util.getRequest(nowurl, "investMoney");
			$.ajax({
				type: "post",
				url: Helper.basePath + 'borrowInfo/card.htm',
				async: false,
				data: {
					borrowId: borrowId,
					investMoney: investMoney,
				},
				datatype: "json",
				xhrFields: { withCredentials: true },
				success: function (data) {
					var data = JSON.parse(data);
					_this.data = data;
					for (var i = 0; i < _this.data.voucherList.length; i++) {
						var carDlist = _this.data.voucherList[i];

						if (carDlist.rewardType === 'CASH_VOUCHER') {
							carDlist.rewardType = 'xian';
							carDlist.rewardName = '现金券';
							carDlist.val = carDlist.val / 100 + '元';
						} else if (carDlist.rewardType === 'RATE_VOUCHER') {
							carDlist.rewardType = 'jia';
							carDlist.rewardName = '加息券';
							carDlist.val = carDlist.val * 100 + '%';
						} else if (carDlist.rewardType === 'EXPERIENCE_VOUCHER') {
							carDlist.rewardType = 'ti';
							carDlist.rewardName = '体验金券';
							carDlist.val = util.fenToYuan('1000000');
							_this.expresscard.push(_this.data.voucherList[i]);
						}

					}

				},
				error: function (data) {

				}
			});
		},
		methods: {
			choosCard: function (voucherId, cardMo, rewardType) {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var investMoney = util.getRequest(nowurl, "investMoney");
				var income = util.getRequest(nowurl, "income");
				var integral = util.getRequest(nowurl, "integral");
				var token = util.getRequest(nowurl, "token");
				//				var reg=/[\u4E00-\u9FA5]/g;
				//				var cardMo =cardMo.replace(reg,'');

				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					data: {
					},
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (loginData) {
						loginData = JSON.parse(loginData);

						if (loginData.isLogin == 'N') {

							if (rewardType === 'ti') {

								window.location.href = "/src/base/login.html?bUrl=/src/invest/pro_investing.html&borrowId=" + borrowId + "&investMoney=" + '10000' + "&income=1&integral=20&voucherId=" + voucherId + "&token=" + token;
							} else {
								window.location.href = "/src/base/login.html?bUrl=/src/invest/investing.html&borrowId=" + borrowId + "&investMoney=" + investMoney + "&income=1&integral=20&voucherId=" + voucherId + "&cardMo=" + cardMo;
							}

						} else {
							if (rewardType === 'ti') {
								window.location.href = "pro_investing.html?borrowId=" + borrowId + "&investMoney=" + '10000' + "&income=1&integral=20&voucherId=" + voucherId + "&token=" + token;
							} else {
								window.location.href = "investing.html?borrowId=" + borrowId + "&investMoney=" + investMoney + "&income=1&integral=20&voucherId=" + voucherId + "&cardMo=" + cardMo;
							}

						}
					},
					error: function (loginData) {

					}
				});
			},


		}



	});
}
//体验金标
iv.expressB = function () {
	var vm = new Vue({
		el: "#proDetail",
		data: {
			data: '',
			borrowType: 'EXPERIENCE',
			token: ''
		},
		created: function () {
			var _this = this;
			var nowurl = window.location.href;
			var borrowId = util.getRequest(nowurl, "borrowId");
			$.ajax({
				type: "post",
				url: Helper.basePath + 'borrowInfo/detail.htm',
				async: false,
				data: {
					borrowId: borrowId
				},
				datatype: "json",
				xhrFields: { withCredentials: true },
				success: function (data) {
					var data = JSON.parse(data);
					_this.data = data;
					/*app 调用参数 */
					if (util.getUrlParam('app') == 'IPHONE') {
						window.webkit.messageHandlers.exchange.postMessage([_this.data.borrow.borrowId]);
					} else if (util.getUrlParam('app') == 'ANDROID') {
						//alert(_this.data.borrow.borrowId);
						android.exchange(_this.data.borrow.borrowId);
					} else {
						//window.location.href='/src/article/integral/order.html?s='+adthis.popData.stockId+'&u='+adthis.shopNum+''
					}


				},
				error: function (data) {

				}
			})
		},
		methods: {
			expresInvest: function () {
				var _this = this;
				var nowurl = window.location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				_this.token = _this.data.token;
				var token = _this.data.token;

				$.ajax({
					type: "post",
					url: Helper.basePath + 'member/isLogin.htm',
					async: false,
					datatype: "json",
					xhrFields: { withCredentials: true },
					success: function (data) {
						data = JSON.parse(data);
						if (data.isLogin == 'N') {
							util.baseLink('/src/base/login.html?bUrl=/src/index/index.html&token=+ token', 1000);
						} else {
							window.location.href = "pro_investing.html?borrowId=" + borrowId + "&token=" + token;
						}
					},
					error: function (data) {

					}
				});


			}
		}



	});
}
iv.investing = function () {
	var vm = new Vue({
		el: "#expressId",
		data: {
			data: "",
			isXieYi: false

		},
		created: function () {
			var _this = this;
			this.getData();
		},
		methods: {
			getData: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var investMoney = util.getRequest(nowurl, "investMoney");
				var voucherId = util.getRequest(nowurl, "voucherId");
				if (investMoney) {
					$("#expresCa").text(investMoney + " 体验金券");
					$("#voucherId").attr("data-id", voucherId);
				}
			},
			getCard: function () {
				var _this = this;
				var nowurl = document.URL;
				nowurl = location.href;
				var borrowId = util.getRequest(nowurl, "borrowId");
				var token = util.getRequest(nowurl, "token");
				$.ajax({
					type: "post",
					url: Helper.basePath + "member/isLogin.htm",
					async: false,
					dataType: "json",
					data: {
						investMoney: '10000',
						borrowInfoId: borrowId,

					},
					xhrFields: { withCredentials: true },
					success: function (data) {
						data = JSON.parse(data);
						_this.data = data;
						if (data.isLogin == 'N') {
							window.location.href = "/src/base/login.html?bUrl=/src/invest/xz_card.html&borrowId=" + borrowId;
						} else {
							window.location.href = "xz_card.html?borrowId=" + borrowId + "&token=" + token;
						}

					}
				});
			},
			ljInvesting: function () {
				var nowurl = document.URL;
				nowurl = location.href;
				var voucherId = util.getRequest(nowurl, "voucherId");
				if (!voucherId) {
					util.toast('请选择一张体验金券');
					return false;
				}
				if (false) {
					//util.toast('请阅读并同意注册协议');
				} else {

					var _this = this;
					var borrowId = util.getRequest(nowurl, "borrowId");
					var version = navigator.appVersion;
					var token = util.getRequest(nowurl, "token");
					var investMoney = util.getRequest(nowurl, "investMoney");
					$.ajax({
						type: "post",
						url: Helper.basePath + 'investInfo/doInvest.htm',
						async: false,
						data: {
							borrowInfoId: borrowId,
							investMoney: investMoney,
							CLIENT_TOKEN_NAME: token,
							voucherId: voucherId,
							userAgent: version,
							retUrl: Helper.webPath + 'src/base/loading.html'
						},
						datatype: "json",
						xhrFields: { withCredentials: true },
						success: function (data) {
							_this.data = data;
							if (data.code === '325') {
								//重复提交投资信息
								util.toast(data.message);
							}

							if (data.code != '000') {
								util.toast(data.message);
							} else {
								window.location.href = Helper.webPath + 'src/account/my_invest.html';;
							}

						},
						error: function (data) {

						}
					});
				}

			}

		}
	});
}












