//神策
//下载App 01
var current_url = location.href;
$(function(){
  $('#download').bind('click', function () {
    sa.track('element_click', {
      campaignName: '红包分享活动',
      lpUrl: current_url,
      elementId: $(this).attr('id'),
      elementContent: '下载App',
      elementName: '下载'
    });
  })
  $('#receive_reward').bind('click', function () {
    sa.track('element_click', {
      campaignName: '红包分享活动',
      lpUrl: current_url,
      elementId: $(this).attr('id'),
      elementContent: '立即领取',
      elementName: '领取红包'
    });
  })
})
function getRule(){
  var ruleText = '';
  $.ajax({
    url: Helper.basePath + 'activityTurntable/activity.htm',
    type: 'POST',
    dataType: 'json',
    async: false,
    xhrFields: {
      withCredentials: true
    },
    data: {
      activityTypeStr: 'SHARE_RED_PACKET'
    }
  }).done(function (data) {
    var data = JSON.parse(data);
    if (data.code !== '000') {
      util.alert(data.message, function () {
        window.location.href = '/src/index/index.html';
      })
      return ;
    }
    ruleText = data.rule;
  })
  return ruleText;
}
var vms = {};
vms.receive = function(){
  new Vue({
    el:'#receive',
    data:{
      hrefJson:util.hrefSplit(window.location.href),
      inp_phone:'',
      reward:[
        '58元现金券',
        '100元现金券',
        '188元现金券',
        '258元现金券'
      ],
      randomNum:0,
      ruleData:'',
      isEmpty:false
    },
    created:function(){
      this.rewardInit();
      this.ruleData = getRule();
      this.getRecode();
    },
    methods:{
      rewardInit:function(){
        var _self = this;
        // var randomNum = ~~(Math.random()*10);
        // if(randomNum>=0&&randomNum<=1){
        //   this.randomNum = 0;
        //   return ;
        // }
        // if(randomNum>=2&&randomNum<=3){
        //   this.randomNum = 1;
        //   return ;
        // }
        // if(randomNum>=4&&randomNum<=6){
        //   this.randomNum = 2;
        //   return ;
        // }
        // if(randomNum>=7&&randomNum<=9){
        //   this.randomNum = 3;
        //   return ;
        // }
        // console.log(randomNum);
        $.ajax({
          url:Helper.basePath+'sharePacket/ltRedPacket.htm',
          type:'POST',
          dataType:'json',
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.code === '000'){
            _self.randomNum = data.prize;
          }
        })
      },
      receiveRed:function(){
        var _self = this;
        var checkPhoneResult = util.checkPhone(this.inp_phone);
        if(checkPhoneResult !== true){
          $('.error_tip').text(checkPhoneResult).show();
          return ;
        }
        $.ajax({
          url:Helper.basePath + 'sharePacket/getRedPackage.htm',
          type:'POST',
          dataType:'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            redPacketId:_self.hrefJson.redPacketId,
            mobile:_self.inp_phone,
            prize:_self.randomNum
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.code === '000'){
            window.location.href = '/src/activity/share_red/receive_suc.html?phoneNum='+ _self.inp_phone+'&redPacketId='+_self.hrefJson.redPacketId;
          }
          util.toast(data.message);
        })
      },
      getRecode:function(){
        var _self = this;
        $.ajax({
          url:Helper.basePath + 'sharePacket/getRedPacketRecord.htm',
          type:'POST',
          dataType:'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            redPacketId:_self.hrefJson.redPacketId
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.list.length>4){
            _self.isEmpty = true;
          }else{
            $('.reward_box').show();
          }
        })
      }
    }
  })
}
vms.receiveSuc = function(){
  new Vue({
    el:'#receive_suc',
    data:{
      hrefJson:util.hrefSplit(window.location.href),
      receivePhone:'',
      receiveList:[]
    },
    created:function(){
      this.receivePhone = this.hrefJson.phoneNum;
      this.getRedPacketRecord();
    },
    methods:{
      getRedPacketRecord:function(){
        var _self = this;
        $.ajax({
          url:Helper.basePath + 'sharePacket/getRedPacketRecord.htm',
          type:'POST',
          dataType:'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            redPacketId:_self.hrefJson.redPacketId
          }
        })
        .done(function(data){
          var data = JSON.parse(data);
          if(data.code === '000'){
            _self.receiveList = data.list;
          }
        })
      }
    }
  })
}