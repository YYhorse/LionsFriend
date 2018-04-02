const app = getApp()
Page({
  data: {
    productList:'',
    store_code:null,
  },
  onLoad: function (options) {
    let tempproductList = JSON.parse(options.productJson);
    console.log(tempproductList);
    if(tempproductList.store_code!=null){
      this.setData({ store_code: tempproductList.store_code})
    }
    this.setData({ productList: tempproductList})
    wx.setNavigationBarTitle({ title: tempproductList.product_name });
  },
  进入狮友店铺:function(e){
    var that = this;
    console.log("点击店铺ID" + that.data.productList.store_code);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreAllInfoUrl,
      data: { 'store_code': that.data.productList.store_code },
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
          wx.showToast({ title: '获取狮友信息错误,接口返回' + Ares.data.status_code, });
        }
      },
      fail: function () { wx.showToast({ title: '获取狮友信息错误，服务器错误' }) }
    })
  }
})