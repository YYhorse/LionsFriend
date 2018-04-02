Page({
  data: {
    userId:null,
    activityList:''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '活动详情'});
    this.setData({
      userId: getApp().globalData.user_id,
      activityList: JSON.parse(options.activityJson)
    })
  },
  点击拨打电话:function(e){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.activityList.contact_number,
    })
  },
  点击删除活动:function(e){
    wx.showLoading({ title: '删除活动中' }),
      wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.DelActivityUrl,
      data: { "user_id": getApp().globalData.user_id, "activity_id": this.data.activityList.activity_id},
        method: 'POST',
        success: function (Ares) {
          wx.hideLoading();
          if (Ares.data.status_code == 200) {
            console.log('删除成功');
            getApp().FlashActivityState = true;
            wx.showModal({
              title: '成功',
              content: '活动删除成功!',
              success: function (res) {
                if (res.confirm || res.cancel)
                  wx.navigateBack();
              }
            })
          }
          else {
            wx.showModal({
              title: '错误提示',
              content: '接口返回错误=' + Ares.data.state_code,
              success: function (res) {
                if (res.confirm || res.cancel)  
                  wx.navigateBack();
              }
            })
          }
        },
        fail: function () { wx.hideLoading(); wx.showToast({ title: '删除活动失败,服务器异常', }) }
      })
  },
  点击查看地点:function(e){
    var that = this;
    console.log('Latitude=' + that.data.activityList.latitude + 'longitude=' + that.data.activityList.longitude)
    wx.openLocation({
      latitude: parseFloat(that.data.activityList.latitude),
      longitude: parseFloat(that.data.activityList.longitude),
      name: that.data.activityList.address_name,
      address: that.data.activityList.address_detail,
      scale: 28
    })
  }
})