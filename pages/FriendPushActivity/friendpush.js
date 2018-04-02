//获取应用实例
const app = getApp()
Page({
  data: {
    TitleText:'',
    Dates:'',
    BeginTime:'',
    EndTime:'',
    PlaceClass:'',
    DetailText:'无',
    image_photo:[],
    PicSelect:0,
    Activity_id:'',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '发布活动' });
  },
  输入标题: function (e) {
    this.setData({ TitleText: e.detail.value })
  },
  输入详情: function (e) {
    this.setData({ DetailText: e.detail.value })
  },
  监听日期变化:function(e){
    this.setData({
      Dates: e.detail.value
    })
  },
  监听开始时间变化:function(e){
    this.setData({
      BeginTime: e.detail.value
    })
  },
  监听结束时间变化: function (e) {
    this.setData({
      EndTime: e.detail.value
    })
  },
  点击选择地点:function(e){
    console.log("点击选择地点")
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({ PlaceClass: res })
      },
    })
  },
  拍摄照片: function (e) {
    var that = this
    if (this.data.image_photo.length<3){
      wx.chooseImage({
        count: 3, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          var tempFilePaths = res.tempFilePaths;
          that.data.image_photo = that.data.image_photo.concat(tempFilePaths);
          that.setData({  image_photo: that.data.image_photo  })
        }
      })
    }
    else{
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'loading',
        duration: 1000
      });  
    }
  },
  点击发布:function(e){
    // console.log(this.data.PlaceClass);
    console.log(this.data.TitleText + "|" + this.data.DetailText + this.data.PlaceClass.address + "|" + this.data.Dates + "|" + this.data.BeginTime + "|" + this.data.EndTime);
    if (this.data.TitleText != '' && this.data.PlaceClass != '' && this.data.Dates!=''
      && this.data.BeginTime != '' && this.data.EndTime != ''){
      if (this.data.image_photo == null)
        wx.showToast({ title: '请上传一张图片', });
      else{
        var that = this;
        wx.showLoading({ title: '提交中' });
        this.UpdateFirstPic();
      }
    }
    else
      wx.showToast({ title: '信息不能为空', });
  },
  UpdateFirstPic:function(){
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.PushActivityUrl,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'activity_images',
      formData: {
        'user_id': getApp().globalData.user_id,
        'title': that.data.TitleText,
        'start_at': that.data.Dates,
        'time_interval': that.data.BeginTime + '-' + that.data.EndTime,
        'address_name': that.data.PlaceClass.name,
        'address_detail': that.data.PlaceClass.address,
        'latitude': that.data.PlaceClass.latitude,
        'longitude': that.data.PlaceClass.longitude,
        'detail': that.data.DetailText,
      },
      success: function (Ares) {
        console.log(Ares.data);
        var json = JSON.parse(Ares.data); 
        if (json.status_code == 200) {
          that.data.Activity_id = json.activity_id;
          that.data.PicSelect = that.data.PicSelect + 1;
          console.log("上传第" + that.data.PicSelect + "张成功!")
          if (that.data.PicSelect == that.data.image_photo.length) {
            wx.hideLoading();
            console.log('上传完成');
            getApp().FlashActivityState = true;
            wx.showModal({
              title: '成功',
              content: '提交成功!',
              success: function (res) {
                if (res.confirm || res.cancel)  wx.navigateBack();
              }
            })
          }
          else
            that.UpdateOtherPic();        //继续上传
        }
        else {
          console.log("上传第" + that.data.PicSelect + "张失败!")
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
      fail: function () { wx.showToast({ title: '获取失败,服务器异常', }) }
    })    
  },
  UpdateOtherPic:function(){
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.PushActivityUrl,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'activity_images',
      formData: { 'activity_id': that.data.Activity_id },
      success: function (Ares) {
        console.log(Ares.data);
        var json = JSON.parse(Ares.data); 
        that.data.PicSelect = that.data.PicSelect + 1;
        if (json.status_code == 200) {
          console.log("上传第" + that.data.PicSelect + "张成功!")
          if (that.data.PicSelect == that.data.image_photo.length) {
            wx.hideLoading();
            console.log('上传完成');
            getApp().FlashActivityState = true;
            wx.showModal({
              title: '成功',
              content: '提交成功!',
              success: function (res) {
                if (res.confirm || res.cancel)
                  wx.navigateBack();
              }
            })
          }
          else
            that.UpdateOtherPic();   //继续上传
        }
        else {
          console.log("上传第" + that.data.PicSelect + "张失败!")
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
      fail: function () { wx.showToast({ title: '获取失败,服务器异常', }) }
    })  
  }
})