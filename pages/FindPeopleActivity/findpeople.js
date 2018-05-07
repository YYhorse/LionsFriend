const app = getApp()
Page({
  data: {
    FindText:null,
    PeopleList:null,
    BackMainStatus:false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '找狮友' });
    if (options.name!=null){
      this.setData({
        BackMainStatus:true,
        FindText: options.name
      })
      this.点击搜索();
    }
  },
  
  输入搜索:function(e){
    this.setData({ FindText: e.detail.value })
  },
  点击搜索:function(e){
    var that = this;
    wx.showLoading({ title: '搜索中' }),
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.FindPeopleUrl,
      data: {'friend_name':that.data.FindText},
      method: 'POST',
      success: function (Ares) {
        wx.hideLoading();
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          that.setData({ PeopleList: Ares.data.friends })
        }
        else if (Ares.data.status_code == 605){
          that.setData({ PeopleList: '' })
        }
        else
          wx.showToast({ title: '搜索信息错误,接口返回' + Ares.data.status_code, });
      },
      fail: function () { wx.hideLoading(); wx.showToast({ title: '获取服务队信息错误' }) }
    })
  },
  点击指定狮友:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    console.log("点击用户ID" + that.data.PeopleList[Index].user_id);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreAllInfoUrl,
      data: { 'user_id': that.data.PeopleList[Index].user_id },
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
  },
  点击进入狮友圈:function(e){
    console.log('进入狮友圈');
    wx.switchTab({ url: '/pages/MainActivity/main' })
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