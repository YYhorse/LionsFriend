const app = getApp()
Page({
  data: {
    StoreInfo:'',
    
    // current_page: 0,
    // Max_page: 100,
    // PullDownRefreshStatus: false,
    // PullUpRefreshStatus: false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '找优惠' });
    var that = this;
    wx.showLoading({ title: '刷新中' }),
      wx.request({
        url: getApp().globalData.HomeUrl + getApp().globalData.FindDiscountUrl,
        data: {},
        method: 'POST',
        success: function (Ares) {
          wx.hideLoading();
          console.log(Ares.data);
          if (Ares.data.status_code == 200) {
            that.setData({ StoreInfo: Ares.data.stores })
          }
          else if (Ares.data.status_code == 605) {
            that.setData({ StoreInfo: '' })
          }
          else
            wx.showToast({ title: '搜索优惠错误,接口返回' + Ares.data.status_code, });
        },
        fail: function () { wx.hideLoading(); wx.showToast({ title: '获取优惠信息错误' }) }
      })
  },
  点击指定店铺:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    console.log("点击店铺ID" + that.data.StoreInfo[Index].code);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreAllInfoUrl,
      data: { 'store_code': that.data.StoreInfo[Index].code },
      method: 'POST',
      success: function (Ares) {
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          let storeJson = JSON.stringify(Ares.data);
          console.log(storeJson);
          wx.navigateTo({ url: '/pages/StoreActivity/store?storeJson=' + storeJson })
        }
        else {
          wx.hideLoading();
          wx.showToast({ title: '获取服务队信息错误,接口返回' + Ares.data.status_code, });
        }
      },
      fail: function () { wx.showToast({ title: '获取店铺信息错误' }) }
    })
  }
  // // 下拉刷新  
  // onPullDownRefresh: function () {
  //   if (this.data.VipStatus == 'vip'){
  //     wx.showNavigationBarLoading();
  //     this.data.PullDownRefreshStatus = true;
  //     this.data.current_page = 0;
  //     this.获取产品();
  //   }
  // },
  // // 上拉加载更多
  // onReachBottom: function () {
  //   console.log("上拉加载");
  //   wx.showNavigationBarLoading();
  //   this.data.PullUpRefreshStatus = true;
  //   this.data.current_page = this.data.current_page + 1;
  //   this.获取产品();
  // },
})