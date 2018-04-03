var app = getApp()      // 获取入口文件app的应用实例
Page({
  data: {
    AvatarUrl: "",
    NiceName:"无",
    StoreShowInfo:'',

    pullDownRefreshStatus:false,
    VipStatus:'',
    ShopStatue:'',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的' });
    this.获取个人信息();
    this.setData({
      AvatarUrl: app.globalData.userInfo.avatarUrl,
      NiceName: app.globalData.userInfo.nickName
    })
  },
  onShow:function(){
    if (app.globalData.FlashUserInfoState == true){
      app.globalData.FlashUserInfoState = false;
      console.log('提交成功，刷新');
      this.获取个人信息();
    }
  },
  点击身份验证:function(e){
    if (this.data.VipStatus == 'tourist')
      wx.navigateTo({ url: '/pages/MyProductActivity/myproduct' });
    else
      wx.showToast({  title: '请耐心等待验证'})
  },
  点击我的名片:function(e){ wx.navigateTo({ url: '/pages/MyCard/mycard' }); },
  点击店铺管理:function(e){
    if (this.data.ShopStatue == 'wait_for_audit')
      wx.showToast({ title: '请耐心等待验证' });
    else
      wx.navigateTo({ url: '/pages/MyShop/myshop' });
  },
  点击产品管理:function(e){
    if (this.data.ShopStatue == 'audit_success' || this.data.ShopStatus == 'audit_rejected')
      wx.navigateTo({ url: '/pages/MyProductActivity/myproduct' });
    else{
      if (this.data.ShopStatue =='wait_for_audit')
        wx.showModal({ content: '请等待店铺审核通过' })
      else
        wx.showModal({ content: '请创建店铺信息' })
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    this.data.pullDownRefreshStatus = true;
    this.获取个人信息();
  },
  获取个人信息:function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.FlashUserUrl,
      data: { 'user_id': getApp().globalData.user_id},
      method: 'POST',
      success: function(Ares) {
        wx.hideNavigationBarLoading();
        if (that.data.pullDownRefreshStatus){
          that.data.pullDownRefreshStatus = false;
          wx.stopPullDownRefresh();
        }
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          //{status_code: 200, user_state: "tourist", store_state: ""}
          that.setData({ 
            VipStatus: Ares.data.user_state,
            ShopStatue: Ares.data.store_state,
          })
          if (Ares.data.user_state == 'vip'){
            //----刷新店铺状态显示-----//
            var temp = '';
            if (that.data.ShopStatue == 'audit_success')
              temp = '审核通过';
            else if (that.data.ShopStatue == 'audit_rejected')
              temp = '审核被拒';
            else if (that.data.ShopStatue == 'wait_for_audit')
              temp = '等待审核';
            else 
              temp = '请创建'; 
            that.setData({ StoreShowInfo: temp });
          }
        }
        else {
          wx.showModal({
            title: '接口异常',
            content: '获取个人信息失败,接口异常' + Ares.data,
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        if (that.data.pullDownRefreshStatus) {
          that.data.pullDownRefreshStatus = false;
          wx.stopPullDownRefresh();
        }
        wx.showModal({
          title: '服务器异常',
          content: '获取指个人信息失败,服务器异常' + Ares.data,
        })
      }
    })
  },
})