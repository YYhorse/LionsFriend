const app = getApp()
// var TempuserInfo = { "user_images": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLTI0d5Vsze6Yib5NWPUHJyTjX4D3N2BGrA6XMh8zFTGXECAGzTpRDia3ib2uPhJXYYvjYOTkIeaoGWw/0", "real_name": "张三", "phone_number": "18698711581", "service_team_name": "XX一队", "admission_time": "2018-03-11", "current_position": "经理", "previous_position": "部长", "honor": "无数奖项" };
Page({
  data: {
    userInfo:'',
    modifyStatus:false,

    image_photo:'',
    real_name:'',
    sex:'',
    phone_number:'',
    company_name:'',
    company_job:'',
    email:'',
    current_residence:'',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的名片' });
    this.获取个人名片信息();
  },
  获取个人名片信息:function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetUserAppliesUrl,
      data: { "user_id": app.globalData.user_id },
      method: 'GET',
      success: function (Ares) {
        console.log(Ares.data);
        wx.hideNavigationBarLoading();       // 隐藏导航栏loading  
        wx.stopPullDownRefresh();
        if(Ares.statusCode == 200){
          that.setData({
            userInfo: Ares.data
          })
        }
      },
      fail: function () {
        wx.hideNavigationBarLoading();       // 隐藏导航栏loading  
        wx.stopPullDownRefresh();
        wx.showToast({ title: '获取失败,服务器异常', }) 
      }
    })
  },
  onShareAppMessage:function(options){
    var that = this;
    console.log(options.from);
    return{
      title: that.data.userInfo.real_name + '的名片',
      path: '/pages/FindPeopleActivity/findpeople?name=' + that.data.userInfo.real_name,
      imageUrl: that.data.userInfo.user_images,
      success(e){
        wx.showShareMenu({
          withShareTicket:true
        });
      },
      fail(e){}
    }
  },
  点击名片编辑:function(e){
    var that = this;
    that.setData({
      modifyStatus: true,
      real_name: that.data.userInfo.real_name,
      phone_number: that.data.userInfo.phone_number,
      sex:that.data.userInfo.sex=='male'?'男性':'女性',
      current_residence: that.data.userInfo.address_detail,
      company_name: that.data.userInfo.company_name,
      company_job: that.data.userInfo.company_job,
      email: that.data.userInfo.email,
    })
  },
  输入姓名:function(e){    this.setData({ real_name: e.detail.value })  },
  输入性别: function (e) { this.setData({ sex:e.detail.value})},
  输入手机号: function (e) { this.setData({ phone_number:e.detail.value})  },
  输入现居地: function (e) { this.setData({ current_residence: e.detail.value })},
  输入公司: function (e) { this.setData({ company_name: e.detail.value }) },
  输入职位: function (e) { this.setData({ company_job: e.detail.value }) },
  输入邮箱: function (e) { this.setData({ email: e.detail.value }) },
  更换头像:function(e){
    var that = this
    if (that.data.modifyStatus==true){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          that.data.image_photo = that.data.image_photo.concat(tempFilePaths);
          that.setData({ image_photo: tempFilePaths[0] })
        }
      })
    }
  },
  点击名片保存:function(e){
    // console.log(this.data.real_name + "|" + this.data.phone_number + "|" + this.data.birthplace + "|" + this.data.current_residence + "|"
    //   + this.data.service_team_name + "|" + this.data.admission_time + "|" + this.data.current_position + "|" + this.data.previous_position + "|" + this.data.honor);
    if (this.data.real_name != '' && this.data.phone_number != ''
      && this.data.birthplace != '' && this.data.current_residence != ''
      && this.data.service_team_name != '' && this.data.admission_time != '') {
      if (this.data.sex=='男性'||this.data.sex=='女性'){
        if (this.data.image_photo == '')
          this.UpdateInfoWithoutPic();
        else
          this.UpdateInfoWithPic();
      }
      else
        wx.showToast({ title: '性别不合法', });
    }
    else
      wx.showToast({ title: '信息未填完', });
  },
  UpdateInfoWithPic: function () {
    var that = this;
    wx.showLoading({ title: '提交中' });
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.PushUserUrl,
      filePath: that.data.image_photo,
      formData: {
        'user_id': app.globalData.user_id,
        'real_name': that.data.real_name,
        'phone_number': that.data.phone_number,
        'address_detail': that.data.current_residence,
        'company_name': that.data.company_name,
        'company_job': that.data.company_job,
        'email': that.data.email,
        'sex': that.data.sex=='男性'?'male':'female'
      },
      success: function (Ares) {
        console.log(Ares.data);
        wx.hideLoading();
        if (Ares.data == '{"status_code":200}') {
          console.log('上传成功');
          wx.showModal({
            title: '成功',
            content: '更新名片信息成功!',
            success: function (res) {
              if (res.confirm || res.cancel) {
                app.globalData.FlashUserInfoState = true;
                wx.navigateBack();
              }
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
      fail: function () {
        wx.hideLoading();
        wx.showToast({ title: '提交失败,服务器异常', })
      }
    })
  },
  UpdateInfoWithoutPic:function(){
    var that = this;
    wx.showLoading({ title: '提交中' });
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.PushUserUrl,
      data: {
        'user_id': app.globalData.user_id,
        'real_name': that.data.real_name,
        'phone_number': that.data.phone_number,
        'address_detail': that.data.current_residence,
        'company_name': that.data.company_name,
        'company_job': that.data.company_job,
        'email': that.data.email,
        'sex': that.data.sex == '男性' ? 'male' : 'female'
      },
      method: 'POST',
      success: function (Ares) {
        console.log(Ares.data);
        wx.hideLoading();
        if (Ares.statusCode == 200) {
          console.log('上传成功');
          wx.showModal({
            title: '成功',
            content: '更新名片信息成功!',
            success: function (res) {
              if (res.confirm || res.cancel) {
                app.globalData.FlashUserInfoState = true;
                wx.navigateBack();
              }
            }
          })
        }
        else {
          wx.showModal({
            title: '错误提示',
            content: '接口返回错误=' + Ares.data,
            success: function (res) {
              if (res.confirm || res.cancel)
                wx.navigateBack();
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({ title: '提交失败,服务器异常', })
      }
    })
  }
})