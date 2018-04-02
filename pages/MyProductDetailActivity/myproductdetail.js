// var temp_product = { "products": { "product_id": 5, "product_name": "干红葡萄酒", "product_detail": "干红葡萄酒", "product_original": "200.0", "product_vip": "159.0", "product_images": [{ "current_url": "https://lionsshop.cn/uploads/product_image/img_url/4/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.lfD54HH1ODUeb5bc31e6cd222ee10e98a46568ca637f.jpg" }, { "current_url": "https://lionsshop.cn/uploads/product_image/img_url/5/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.gaktLXj1m677c6aa7094688195ce91f7280899bbfa47.jpg" }] } };
Page({
  data: {
    productName: null,
    productDetail: null,
    productOriginal: null,
    productVip: null,
    productId: null,
    shop_images:[],
    image_photo: [],
    PicSelect: 0,
  },
  onLoad: function (options) {
    //获取
    let tempList = JSON.parse(options.productJson);
    console.log(tempList);
    wx.setNavigationBarTitle({ title: tempList.product_name });
    this.setData({
      productId: tempList.product_id,
      productName: tempList.product_name,
      productDetail: tempList.product_detail,
      productOriginal: tempList.product_original,
      productVip: tempList.product_vip,
      shop_images: tempList.product_images
    })
  },
  输入产品名称: function (e) {
    this.setData({ productName: e.detail.value })
  },
  输入产品详情: function (e) {
    this.setData({ productDetail: e.detail.value })
  },
  输入产品原价: function (e) {
    this.setData({ productOriginal: e.detail.value })
  },
  输入产品会员价: function (e) {
    this.setData({ productVip: e.detail.value })
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
  点击删除产品:function(e){
    var that = this;
    wx.showLoading({ title: '删除产品中' }),
      wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.DelProductUrl,
      data: { 
        "user_id": getApp().globalData.user_id, 
        "store_code": getApp().globalData.store_code, 
        "product_id": that.data.productId,
        },
        method: 'POST',
        success: function (Ares) {
          wx.hideLoading();
          console.log(Ares.data);
          if (Ares.data.status_code == 200) {
            console.log('删除成功');
            wx.showModal({
              title: '成功',
              content: '业务删除成功!',
              success: function (res) {
                if (res.confirm || res.cancel){
                  getApp().globalData.FlashProductState = true;
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
                if (res.confirm || res.cancel){
                  getApp().globalData.FlashProductState = true;
                  wx.navigateBack();
                }
              }
            })
          }
        },
        fail: function () { wx.hideLoading(); wx.showToast({ title: '删除业务失败,服务器异常', }) }
      })
  },
  点击更新产品: function (e) {
    console.log(this.data.productName + "|" + this.data.productDetail + "|" + this.data.productOriginal + "|" + this.data.productVip);
    console.log(this.data.image_photo);
    if (this.data.productName != null && this.data.productDetail != null
      && this.data.productOriginal != null && this.data.productVip != null) {
      if (this.data.image_photo.length == 0){
        console.log('无图片更新数据');
        wx.showLoading({ title: '提交中' });
        this.UpdateProductInfo();
      }
      else {
        wx.showLoading({ title: '提交中' });
        this.UpdateFirstPic();
      }
    }
    else
      wx.showToast({ title: '信息不能为空', });

  },
  UpdateProductInfo:function(){
    var that = this;
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.UpdataProductUrl,
      data: {
        'user_id': getApp().globalData.user_id,
        'store_code': getApp().globalData.store_code,
        'product_id': that.data.productId,
        'product_name': that.data.productName,
        'product_detail': that.data.productDetail,
        'product_original': that.data.productOriginal,
        'product_vip': that.data.productVip,
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
              if (res.confirm || res.cancel) {
                getApp().globalData.FlashProductState = true;
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
              if (res.confirm || res.cancel) {
                getApp().globalData.FlashProductState = true;
                wx.navigateBack();
              }
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
      url: getApp().globalData.HomeUrl + getApp().globalData.CreatProductUrl,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'product_images',
      formData: {
        'user_id': getApp().globalData.user_id,
        'store_code': getApp().globalData.store_code,
        'product_id': that.data.productId,
        'product_name': that.data.productName,
        'product_detail': that.data.productDetail,
        'product_original': that.data.productOriginal,
        'product_vip': that.data.productVip,
      },
      success: function (Ares) {
        console.log(Ares.data);
        var json = JSON.parse(Ares.data);
        if (json.status_code == 200) {
          that.data.product_id = json.product_id;
          that.data.PicSelect = that.data.PicSelect + 1;
          console.log("上传第" + that.data.PicSelect + "张成功!")
          if (that.data.PicSelect == that.data.image_photo.length) {
            wx.hideLoading();
            console.log('上传完成');
            wx.showModal({
              title: '成功',
              content: '提交成功!',
              success: function (res) {
                getApp().globalData.FlashProductState = true;
                wx.navigateBack();
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
              if (res.confirm || res.cancel) {
                getApp().globalData.FlashProductState = true;
                wx.navigateBack();
              }
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
      url: getApp().globalData.HomeUrl + getApp().globalData.UpdataProductImage,
      filePath: that.data.image_photo[that.data.PicSelect],
      name: 'product_images',
      formData: { 'user_id': getApp().globalData.user_id, 'store_code': getApp().globalData.store_code, 'product_id': that.data.product_id },
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
                if (res.confirm || res.cancel) {
                  getApp().globalData.FlashProductState = true;
                  wx.navigateBack();
                }
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
