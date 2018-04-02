//获取应用实例
const app = getApp()
Page({
  data: {
    FlashSelectFlag:false,
    IndustriesList:null,
    StoresList:null,
    SelectPostion:0,
    FindText: null,
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({ title: '分类' });
    wx.getSystemInfo({  success: function (res) { that.setData({  scrollHeight: parseInt(res.windowHeight) - 50 }) } });
    if (app.globalData.FlashSelectFlag == false)
      this.获取所有行业信息();
  },
  onShow:function(){
    if (app.globalData.FlashSelectFlag == true){
      console.log("分类刷新=");
      this.加载行业下产品();
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    this.加载行业下产品();
  },
  输入搜索:function(e){
    this.setData({ FindText: e.detail.value })
  },
  点击搜索:function(e){
    var that = this;
    wx.showLoading({ title: '搜索中' }),
      wx.request({
        url: getApp().globalData.HomeUrl + getApp().globalData.FindProductUrl,
        data: { 'product_name': that.data.FindText },
        method: 'POST',
        success: function (Ares) {
          wx.hideLoading();
          console.log(Ares.data);
          if (Ares.data.status_code == 200) {
            let productListJson = JSON.stringify(Ares.data.products);
            wx.navigateTo({ url: '/pages/FindProductActivity/findproduct?productListJson=' + productListJson });
          }
          else if (Ares.data.status_code == 605)
            wx.showToast({ title: '未搜索到信息' });
          else
            wx.showToast({ title: '搜索信息错误,接口返回' + Ares.data.status_code, });
        },
        fail: function () { wx.hideLoading(); wx.showToast({ title: '获取服务队信息错误' }) }
      })
  },
  获取所有行业信息:function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetIndustriesUrl,
      data: {},
      method: 'GET',
      success: function (Ares) {
        console.log(Ares.data);
        wx.hideNavigationBarLoading();       // 隐藏导航栏loading  
        wx.stopPullDownRefresh();
        if (Ares.statusCode == 200) {
          that.setData({  IndustriesList:Ares.data.industries });
          that.加载行业下产品();
        }
      },
      fail: function () {
        wx.hideNavigationBarLoading();       // 隐藏导航栏loading  
        wx.stopPullDownRefresh();
        wx.showToast({ title: '获取行业信息失败,服务器异常', })
      }
    })
  },
  加载行业下产品:function(){
    wx.showNavigationBarLoading();
    var that = this;
      wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetIndustriesStoreUrl,
      data: { "industry_code": that.data.IndustriesList[that.data.SelectPostion].code},
        method: 'POST',
        success: function (Ares) {
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          console.log(Ares.data);
          if (Ares.data.status_code == 200) {
            that.setData({  StoresList: Ares.data.stores  })
          }
          else if (Ares.data.status_code == 605){
           that.setData({ StoresList: '' })
          }
          else{
            wx.showModal({
              title: '接口异常',
              content: '获取指定行业店铺失败,接口异常' + Ares.data,
            })
          }
        },
        fail: function () {
          wx.hideLoading(); 
          wx.showModal({
            title: '服务器异常',
            content: '获取指定行业店铺失败,服务器异常' + Ares.data,
          })}
      })
  },
  选中行业显示:function(e){
    var Index = e.currentTarget.dataset.numid;
    this.data.SelectPostion = Index;
    this.setData({ SelectPostion: Index});
    this.加载行业下产品();
  },
  点击指定店铺:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    console.log("点击店铺ID" + that.data.StoresList[Index].code);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreAllInfoUrl,
      data: { 'store_code': that.data.StoresList[Index].code },
      method: 'POST',
      success: function (Ares) {
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          let storeJson = JSON.stringify(Ares.data);
          console.log(storeJson);
          wx.navigateTo({ url: '/pages/StoreActivity/store?storeJson=' + storeJson})
        }
        else {
          wx.hideLoading();
          wx.showToast({ title: '获取服务队信息错误,接口返回' + Ares.data.status_code, });
        }
      },
      fail: function () { wx.showToast({ title: '获取店铺信息错误' }) }
    })
  }
})