Page({
  data: {
    UserId: getApp().globalData.user_id,
    friendList:"",
    current_page:0,
    Max_page:100,
    PullDownRefreshStatus:false,
    PullUpRefreshStatus:false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '狮友圈' });
    this.获取活动();
    console.log('活动userid' + this.data.UserId);
  },
  // 下拉刷新  
  onPullDownRefresh: function () { 
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    this.data.PullDownRefreshStatus = true;
    this.data.current_page = 0;
    this.获取活动();
  },
  // 上拉加载更多
  onReachBottom:function(){
    console.log("上拉加载");
    wx.showNavigationBarLoading();
    this.data.PullUpRefreshStatus = true;
    this.data.current_page = this.data.current_page + 1;
    this.获取活动();
  },
  获取活动:function(e){
    var that = this;
      wx.request({
        url: getApp().globalData.HomeUrl + getApp().globalData.GetActivityUrl,
        data: { 'current_page': that.data.current_page},
        method: 'GET',
        success: function (Ares) {
          console.log(Ares.data);
          //-------处理网络数据-------//
          if (Ares.data.status_code == 200){
            if (that.data.PullUpRefreshStatus){
              //上拉加载更多
              var temp_list = that.data.friendList;
              for (var i = 0; i < Ares.data.friend_info.length;i++)
                temp_list.push(Ares.data.friend_info[i]);
              that.setData({  friendList: temp_list })
            }
            else{
              //下拉刷新 或者 正常加载
              that.setData({  friendList: Ares.data.friend_info })
              that.setData({  friendList: that.data.friendList  })
            }
          }
          else if (Ares.data.status_code == 604){
            wx.showToast({ title: '狮友圈无活动!', })
            if (that.data.current_page < that.data.Max_page)
              that.data.Max_page = that.data.current_page;
            else
              that.data.current_page--;
          }
          else
            wx.showModal({ title: '异常', content: '接口访问异常!Code=' + Ares.data.status })
          //--------加载条隐藏-------//
          if (that.data.PullDownRefreshStatus || that.data.PullUpRefreshStatus) {
            that.data.PullUpRefreshStatus = false;
            that.data.PullDownRefreshStatus = false;
            // 隐藏导航栏loading  
            wx.hideNavigationBarLoading();
            // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
            wx.stopPullDownRefresh();
          }
        },
      fail: function () { wx.showToast({ title: '获取失败,服务器异常', }) }
    })
  },
  点击指定活动:function(e){
    var Index = e.currentTarget.dataset.numid;
    let activityJson = JSON.stringify(this.data.friendList[Index]);
    console.log('点击事件'+Index);
    console.log(activityJson); 
    wx.navigateTo({ url: '/pages/FriendDetailActivity/frienddetail?activityJson=' + activityJson })
  },
  点击发布活动:function(e){
    wx.showActionSheet({
      itemList: ['发布动态', '发布活动'],
      success: function (res) {
        if (res.tapIndex == 0){
          //发布动态
          wx.navigateTo({ url: '/pages/FriendPushBActivity/friendpushb' });
        }
        else {
          //发布活动
          wx.navigateTo({ url: '/pages/FriendPushActivity/friendpush' });
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })  
  },
  浏览图片:function(e){
      var current = e.target.dataset.src;
      console.log(current);
      var piclist =[];
      piclist.push(current)
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: piclist // 需要预览的图片http链接列表  
      })
  },
  onShow: function () {
    if (getApp().FlashActivityState == true) {
      console.log('成功发布活动后刷新')
      getApp().FlashActivityState = false;
      this.data.current_page = 0;
      this.获取活动();
    }
  }
})