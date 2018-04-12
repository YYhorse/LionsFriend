//获取应用实例
const app = getApp()
Page({
  data: {
    DynamicAdUrl: null,
    StaticAdUrl: null,
    StoreInfo:null,
    pullDownRefreshStatus:false,
  },
  onLoad: function (options) {
    this.获取首页信息();
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    this.data.pullDownRefreshStatus = true;
    this.获取首页信息();
  },
  获取首页信息:function(){
    var that = this;
    wx.setNavigationBarTitle({ title: '首页' });
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetHomeUrl,
      data: {},
      method: 'GET',
      success: function (Ares) {
        console.log(Ares.data);
        if (that.data.pullDownRefreshStatus){
          that.data.pullDownRefreshStatus = false;
          wx.stopPullDownRefresh();
        }
        if (Ares.data.status == 500)
          wx.showModal({ title: '异常', content: '接口访问异常!Code=' + Ares.data.status })
        else {
          that.setData({
            DynamicAdUrl: Ares.data.image_infos,
            StaticAdUrl: Ares.data.advertisement_url,
            StoreInfo: Ares.data.stores,
          })
        }
      },
      fail: function () { 
        wx.showModal({ title: '服务器错误' }) 
      }
    })
  },
  点击找狮友:function(e){
    wx.navigateTo({ url: '/pages/FindPeopleActivity/findpeople'})
  },
  点击找产品:function(e){
    wx.navigateTo({ url: '/pages/FindProductActivity/findproduct' })
  },
  点击找优惠:function(e){
    wx.navigateTo({ url: '/pages/FindDiscountActivity/finddiscount' })
  },
  点击更多:function(e){
    wx.switchTab({ url: '/pages/HelpActivity/help' })
  },
  点击指定店铺:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    console.log("点击店铺ID" + that.data.StoreInfo[Index].store_code);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreAllInfoUrl,
      data: { 'store_code': that.data.StoreInfo[Index].store_code},
      method: 'POST',
      success: function (Ares) {
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          let storeJson = JSON.stringify(Ares.data);
          console.log(storeJson);
          wx.navigateTo({ url: '/pages/StoreActivity/store?storeJson=' + storeJson })
        }
        else {
          wx.showModal({
            title: '接口错误',
            content: Ares.data.error,
          })
        }
      },
      fail: function () {
        wx.showModal({  title: '服务器错误'}) 
      }
    })
  },
  浏览图片: function (e) {
    var current = e.target.dataset.src;
    console.log(current);
    var piclist = [];
    piclist.push(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: piclist // 需要预览的图片http链接列表  
    })
  },
})
