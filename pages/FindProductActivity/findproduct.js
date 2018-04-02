const app = getApp()
Page({
  data: {
    FindText:null,
    ProductList:null,

    // current_page: 0,
    // Max_page: 100,
    // PullDownRefreshStatus: false,
    // PullUpRefreshStatus: false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '找产品' });
    if (options.productListJson!=null){
      let tempproductList = JSON.parse(options.productListJson);
      console.log(tempproductList);
      this.setData({ ProductList: tempproductList })
    }
  },
  // onShow: function () {

  // },
  请输入产品信息:function(e){
    this.setData({ FindText: e.detail.value })
  },
  点击搜索:function(e){
    var that = this;
    wx.showLoading({ title: '搜索中' }),
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.FindProductUrl,
      data: {'product_name':that.data.FindText},
      method: 'POST',
      success: function (Ares) {
        wx.hideLoading();
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          that.setData({ ProductList: Ares.data.products })
        }
        else if (Ares.data.status_code == 605) {
          that.setData({ ProductList: '' })
        }
        else
          wx.showToast({ title: '搜索信息错误,接口返回' + Ares.data.status_code, });
      },
      fail: function () { wx.hideLoading(); wx.showToast({ title: '获取服务队信息错误' }) }
    })
  },
  点击指定产品:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    let productJson = JSON.stringify(that.data.ProductList[Index]);
    // console.log(productJson);
    wx.navigateTo({ url: '/pages/ProductShow/productshow?productJson=' + productJson })
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