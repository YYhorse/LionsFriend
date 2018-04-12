// var TempShopInfo = { "shop_name": "大连华月七星月子会所", "shop_detail": "引领中国高品质母婴生活方式，让每一位新生妈妈都能享受到科学健康的月子照护。↵    本公司是“中国母婴保健协会”理事单位，全国月子会所联盟理事单位，辽宁月子会所联盟发起单位，也是“大连市母婴照护行业协会”的发起单位。", "address_detail": "辽宁省大连市沙河口区星海广场城堡酒店公寓", "address_name": "华月七星月子会所(城堡店)", "latitude": "38.87862083167476", "longitude": "121.59501317744581", "shop_discount": "无", "shop_images": [{ "current_url": "https://lionsshop.cn/uploads/store_image/img_url/23/tmp_981c60763ee402eae590542b4b0e161a.jpg" }] };
Page({
  data: {
    // shopInfo:'',
    shopCode:'',
    shopName:'',
    shopDetail:'',
    addressName:'',
    addressDetail: '',
    addressLatitude: '',
    addressLongitude: '',
    shopDiscount:'无',
    Index: 0,
    Industries: ['请选择行业'],
    IndustriesCode:[],  
    shop_images:[],
    image_photo: [],
    PicSelect: 0,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的店铺' });
    this.获取所有行业信息();
  },
  输入店铺名称:function(e){
    this.setData({ shopName: e.detail.value })
  },
  输入店铺详情:function (e) {
    this.setData({ shopDetail: e.detail.value })
  },
  点击选择地点:function (e) {
    console.log("点击选择地点")
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({ 
          addressName: res.name,
          addressDetail: res.address,
          addressLatitude: res.latitude,
          addressLongitude: res.longitude
        })
      }
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
          var temp = [];
          var tempCode = [];
          // temp.push("请选择行业");
          for (var i = 0; i < Ares.data.industries.length;i++){
            temp.push(Ares.data.industries[i].name);
            tempCode.push(Ares.data.industries[i].code);
          }
          that.setData({ 
            Industries: temp,
            IndustriesCode: tempCode,
          });
          that.获取店铺信息();
        }
      },
      fail: function () {
        wx.hideNavigationBarLoading();       // 隐藏导航栏loading  
        wx.stopPullDownRefresh();
        wx.showToast({ title: '获取行业信息失败,服务器异常', })
      }
    })
  },
  获取店铺信息:function(){
    var that = this;
    wx.showLoading({ title: '获取店铺信息' }),
      wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetStoreInfoUrl,
      data: { 'user_id': getApp().globalData.user_id},
        method: 'GET',
        success: function (Ares) {
          console.log(Ares.data);
          wx.hideLoading();
          if (Ares.data.status_code == 200) {
            if (Ares.data.industry_code!=""){
              for (var i = 0; i < that.data.IndustriesCode.length;i++){
                if (Ares.data.industry_code == that.data.IndustriesCode[i]){
                  that.data.Index = i;
                  console.log('找到行业' + that.data.Industries[that.data.Index]);
                  that.setData({
                    Index: that.data.Index,
                    // IndustriesCode: that.data.IndustriesCode[that.data.Index],
                  });
                }
              }
            }
            that.setData({
              shopCode: Ares.data.code,
              shopName: Ares.data.shop_name,
              shopDetail: Ares.data.shop_detail,
              addressName: Ares.data.address_name,
              addressDetail: Ares.data.address_detail,
              addressLatitude: Ares.data.latitude,
              addressLongitude: Ares.data.longitude,
              shopDiscount: Ares.data.shop_discount == null ? '无' : Ares.data.shop_discount,
              shop_images: Ares.data.shop_images
            })
          }
          else if (Ares.data.status_code == 605){
            wx.showModal({
              title: '请创建店铺',
              content: '店铺无信息，请填写信息'
            })
          }
          else {
            wx.showToast({ title: '获取服务队信息错误,接口返回' + Ares.data.status_code, });
          }
        },
        fail: function () { wx.hideLoading(); wx.showToast({ title: '获取服务队信息错误' }) }
      })
  },
  输入店铺优惠:function(e) {
    this.setData({ shopDiscount: e.detail.value })
  },
  监听所属行业:function(e){
    this.setData({ Index: e.detail.value })  
  },
  拍摄照片: function (e) {
    var that = this
    if (this.data.image_photo.length < 3) {
      wx.chooseImage({
        count: 3, // 默认9  
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
          var tempFilePaths = res.tempFilePaths;
          that.data.image_photo = that.data.image_photo.concat(tempFilePaths);
          that.setData({ image_photo: that.data.image_photo })
        }
      })
    }
    else {
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'loading',
        duration: 1000
      });
    }
  },
  点击更新:function(e){
    console.log(this.data.shopName + "|" + this.data.shopDetail + this.data.addressName);
    console.log("id=" + this.data.Index+ this.data.Industries[this.data.Index]+"|"+this.data.IndustriesCode[this.data.Index])
    console.log(this.data.image_photo);
    if (this.data.shopName != null && this.data.addressName != null 
      && this.data.Industries[this.data.Index] !='请选择行业') {
      if (this.data.image_photo.length==0){
        //wx.showToast({ title: '请上传一张图片', });
        console.log('无图片更新数据');
        wx.showLoading({ title: '提交中' });
        this.UpdateShopInfo();
      }
      else {
        wx.showLoading({ title: '提交中' });
        this.UpdateFirstPic();
      }
    }
    else
      wx.showToast({ title: '信息不能为空', });

  },
  UpdateShopInfo:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.UpdataStoreNoImage,
      data: {
        'user_id': getApp().globalData.user_id,
        'store_code': that.data.shopCode,
        'industry_code': that.data.IndustriesCode[that.data.Index],
        'shop_name': that.data.shopName,
        'shop_detail': that.data.shopDetail,
        'address_name': that.data.addressName,
        'address_detail': that.data.addressDetail,
        'latitude': that.data.addressLatitude,
        'longitude': that.data.addressLongitude,
        'shop_discount': that.data.shopDiscount
      },
      method: 'POST',
      success: function (Ares) {
        console.log(Ares.data);
        if (Ares.data.status_code == 200) {
          wx.hideLoading();
          console.log('上传完成');
          wx.showModal({
            title: '成功',
            content: '提交成功!',
            success: function (res) {
              if (res.confirm || res.cancel){
                getApp().globalData.FlashUserInfoState = true;
                wx.navigateBack();
              }
            }
          })
        }
        else {
          wx.hideLoading();
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
      fail: function () { wx.hideLoading(); wx.showToast({ title: '获取服务队信息错误' }) }
    })
  },
  UpdateFirstPic: function () {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.UpdataStoreInfoUrl,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'shop_images',
      formData: {
        'user_id': getApp().globalData.user_id,
        'store_code': that.data.shopCode,
        'industry_code': that.data.IndustriesCode[that.data.Index],
        'shop_name': that.data.shopName,
        'shop_detail': that.data.shopDetail,
        'address_name': that.data.addressName,
        'address_detail': that.data.addressDetail,
        'latitude': that.data.addressLatitude,
        'longitude': that.data.addressLongitude,
        'shop_discount': that.data.shopDiscount
      },
      success: function (Ares) {
        console.log(Ares.data);
        var json = JSON.parse(Ares.data);
        if (json.status_code == 200) {
          that.data.shopCode = json.store_code;
          that.data.PicSelect = that.data.PicSelect + 1;
          console.log("上传第" + that.data.PicSelect + "张成功!")
          if (that.data.PicSelect == that.data.image_photo.length) {
            wx.hideLoading();
            console.log('上传完成');
            wx.showModal({
              title: '成功',
              content: '提交成功!',
              success: function (res) {
                if (res.confirm || res.cancel) wx.navigateBack();
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
      fail: function () {
        wx.showModal({
          title: '错误提示',
          content: '服务器返回错误',
        }) 
      }
    })
  },
  UpdateOtherPic: function () {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.HomeUrl + getApp().globalData.UpdataStoreImage,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'shop_images',
      formData: { 'user_id': getApp().globalData.user_id, 'store_code': that.data.shopCode },
      success: function (Ares) {
        console.log(Ares.data);
        var json = JSON.parse(Ares.data);
        that.data.PicSelect = that.data.PicSelect + 1;
        if (json.status_code == 200) {
          console.log("上传第" + that.data.PicSelect + "张成功!")
          if (that.data.PicSelect == that.data.image_photo.length) {
            wx.hideLoading();
            console.log('上传完成');
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
  },
  点击联系客服:function(e){
    wx.makePhoneCall({ phoneNumber: '13079896396' })
  }
})
