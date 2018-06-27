//获取应用实例
var temp_product = { "product_info": [{ "product_id": "1", "product_name": "82年拉菲红酒", "product_detail": "这是82年珍藏版拉菲红酒", "product_original": "998.0", "product_vip": "666.0", "product_images": [{ "current_url": "https://lionsshop.cn/uploads/personal_dynamic_image/img_url/15/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.4z9yiylrKqAs7be8bb1e87b5bb5e1781b69fbaecbe23.jpg" }] }, { "product_id": "2", "product_name": "92年拉菲红酒", "product_detail": "这是92年珍藏版拉菲红酒", "product_original": "888.0", "product_vip": "599.0", "product_images": [{ "current_url": "https://lionsshop.cn/uploads/personal_dynamic_image/img_url/15/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.4z9yiylrKqAs7be8bb1e87b5bb5e1781b69fbaecbe23.jpg" }] }] };
const app = getApp()
Page({
  data: {
    VipStatus: '',
    image_photo:'',
    RealName: '',
    PhoneNumber: '',
    AddressDetail:'',
    Dates:'2018-08-08',

    SexInfo: ['男性', '女性'],
    SexIndex:0,
    ProductList:'',
    current_page: 0,
    Max_page: 100,
    PullDownRefreshStatus: false,
    PullUpRefreshStatus: false,
  },
  onLoad: function (options) {
    this.setData({ VipStatus: app.globalData.vipStatus });
    console.log("子状态:" + this.data.VipStatus);
    if (this.data.VipStatus == 'vip') {
      wx.setNavigationBarTitle({ title: '产品管理' });
      this.获取产品();
    }
    else
      wx.setNavigationBarTitle({ title: '身份验证' });
  },
  onShow: function () {
    if (getApp().globalData.FlashProductState == true) {
      console.log('成功编辑后刷新')
      getApp().globalData.FlashProductState = false;
      this.获取产品();
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    if (this.data.VipStatus == 'vip'){
      wx.showNavigationBarLoading();
      this.data.PullDownRefreshStatus = true;
      this.data.current_page = 0;
      this.获取产品();
    }
  },
  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.VipStatus == 'vip') {
      console.log("上拉加载");
      wx.showNavigationBarLoading();
      this.data.PullUpRefreshStatus = true;
      this.data.current_page = this.data.current_page + 1;
      this.获取产品();
    }
  },
  上传照片:function(e){
    var that = this
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
  },
  输入姓名: function (e) {
    this.setData({ RealName: e.detail.value })
  },
  输入手机号: function (e) {
    this.setData({ PhoneNumber: e.detail.value })
  },
  输入现居地: function (e) {
    this.setData({ AddressDetail: e.detail.value })
  },
  // 监听日期变化: function (e) {
  //   this.setData({
  //     Dates: e.detail.value
  //   })
  // },
  监听性别变化:function(e){
    this.setData({
      SexIndex: e.detail.value
    });
  },
  // 点击选择地点: function (e) {
  //   console.log("点击选择地点")
  //   var that = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       that.setData({ AddressDetail: res.address  })
  //     }
  //   })
  // },
  点击提交信息: function (e) {
    console.log("姓名:" + this.data.RealName + "手机号:" + this.data.PhoneNumber + "出生日期:" + this.data.Dates+ "现居地:" + this.data.AddressDetail+ "图片:"+this.data.image_photo);
    if (this.data.RealName != '' && this.data.PhoneNumber != '' && this.data.AddressDetail != '') {
      if (this.data.image_photo=='')
        wx.showToast({ title: '请上传一张图片', });
      else {
        wx.showLoading({ title: '提交中' });
        this.UpdateInfo();
      }
    }
    else
      wx.showToast({ title: '信息未填全', });
  },
  UpdateInfo:function(){
    var that = this;
    wx.showLoading({ title: '提交中' });
    var sexString = that.data.SexIndex == 0?'male':'female';
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.PushUserUrl,
      filePath: that.data.image_photo,
      name: 'avatar',
      formData: {
        'user_id': app.globalData.user_id,
        'real_name': that.data.RealName,
        'phone_number': that.data.PhoneNumber,
        'address_detail': that.data.AddressDetail,
        'sex':sexString,
        'birthday': that.data.Dates
      },
      success: function (Ares) {
        console.log(Ares.data);
        wx.hideLoading();
        if (Ares.data == '{"status_code":200}') {
          console.log('上传成功');
          wx.showModal({
            title: '成功',
            content: '验证信息提交成功!',
            success: function (res) {
              if (res.confirm || res.cancel){
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
        wx.showToast({ title: '获取失败,服务器异常', }) }
      })    
  },  
  ///////////////////////////////////////////////////////////////////////////////////////////
  //////////////                      产品管理                                 ///////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  获取产品: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetProductsUrl,
      data: { "user_id": app.globalData.user_id, "store_code": app.globalData.store_code, "current_page": that.data.current_page},
      method: 'GET',
      success: function (Ares) {
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          if (that.data.PullUpRefreshStatus) {
            //上拉加载更多
            var temp_list = that.data.ProductList;
            for (var i = 0; i < Ares.data.products.length; i++)
              temp_list.push(Ares.data.products[i]);

            console.log(temp_list);  
            that.setData({ ProductList: temp_list })
          }
          else {
            //下拉刷新 或者 正常加载
            that.setData({ ProductList: Ares.data.products })
            that.setData({ ProductList: that.data.ProductList })
          }
        }
        else if (Ares.data.status_code == 605){
          wx.showToast({ title: '无更多产品', })
          if (that.data.current_page < that.data.Max_page)
            that.data.Max_page = that.data.current_page;
          else
            that.data.current_page--;
        }
        else{
          wx.showModal({
            title: '接口错误',
            content: '获取产品接口错误'+Ares.data
          })
        }
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
      fail: function () { wx.showToast({ title: '获取产品失败,服务器异常', }) }
    })
  },

  点击指定产品: function (e) {
    var Index = e.currentTarget.dataset.numid;
    let ProductJson = JSON.stringify(this.data.ProductList[Index]);
    wx.navigateTo({ url: '/pages/MyProductDetailActivity/myproductdetail?productJson=' + ProductJson })
  },
  点击发布产品: function (e) {
    wx.navigateTo({ url: '/pages/MyProductNewActivity/myproductnew' });
  },
})