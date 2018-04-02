const app = getApp()
// var tempInfo = { "user_images": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLTI0d5Vsze6Yib5NWPUHJyTjX4D3N2BGrA6XMh8zFTGXECAGzTpRDia3ib2uPhJXYYvjYOTkIeaoGWw/0", "real_name": "张三", "phone_number": "18698711581", "service_team_name": "XX一队", "admission_time": "2018-03-11", "current_position": "经理", "previous_position": "部长", "honor": "无数奖项", "shop_name": "大连华月七星月子会所", "shop_detail": "引领中国高品质母婴生活方式，让每一位新生妈妈都能享受到科学健康的月子照护。↵ 本公司是“中国母婴保健协会”理事单位，全国月子会所联盟理事单位，辽宁月子会所联盟发起单位，也是“大连市母婴照护行业协会”的发起单位。", "address_detail": "辽宁省大连市沙河口区星海广场城堡酒店公寓", "address_name": "华月七星月子会所(城堡店)", "latitude": "38.87862083167476", "longitude": "121.59501317744581", "shop_discount": "无", "shop_images": [{ "current_url": "https://lionsshop.cn/uploads/store_image/img_url/23/tmp_981c60763ee402eae590542b4b0e161a.jpg" }] };
Page({
  data: {
    FindStoreCode:'',     //查询的店铺Code
    SelectPostion:0,      //0名片   1店铺
    ShopSelectPostion:0,  //0全部商品  1店铺简介  2店铺优惠  3店铺地址
    ShopInfoList:'',
    ShowTitle:'',           //显示店铺描述 或者优惠 
    ShowContext:'',        //显示店铺描述和优惠
    ProductList: '',
    current_page: 0,
    Max_page: 100,
    PullDownRefreshStatus: false,
    PullUpRefreshStatus: false,
    scrollHeight: null,
  },
  onLoad: function (options) {
    var that = this;
    let storeList = JSON.parse(options.storeJson);
    console.log(storeList);
    wx.setNavigationBarTitle({ title: storeList.shop_name });
    this.setData({
      ShopInfoList: storeList,
      FindStoreCode: storeList.code
    })
    //获取系统的参数，scrollHeight数值,微信必须要设置style:height才能监听滚动事件
    wx.getSystemInfo({ success: function (res) { that.setData({  scrollHeight: parseInt(res.windowHeight) - 200 }) } });
  },
  选择名片:function(e){
    if (this.data.SelectPostion!=0){
      this.data.SelectPostion = 0;
      this.setData({SelectPostion:this.data.SelectPostion})
    }
  },
  选择店铺: function (e) {
    if (this.data.SelectPostion != 1) {
      this.data.SelectPostion = 1;
      this.setData({ SelectPostion: this.data.SelectPostion })
      //----获取商品信息-----//
      this.获取产品();
    }
  },
  选择拨号:function(e){
    var that = this;
    wx.makePhoneCall({  phoneNumber: that.data.ShopInfoList.phone_number  })
  },
  选择全部商品:function(e){
    if (this.data.ShopSelectPostion != 0) {
      this.data.ShopSelectPostion = 0;
      this.setData({ ShopSelectPostion: this.data.ShopSelectPostion })
      //----获取商品信息-----//
      this.获取产品();
    }
  },
  选择店铺简介: function (e) {
    if (this.data.ShopSelectPostion != 1) {
      this.data.ShopSelectPostion = 1;
      this.setData({ 
        ShopSelectPostion: this.data.ShopSelectPostion,
        ShowTitle:'店铺简介',
        ShowContext: this.data.ShopInfoList.shop_detail
      })
    }
  },
  选择店铺优惠: function (e) {
    if (this.data.ShopSelectPostion != 2) {
      this.data.ShopSelectPostion = 2;
      this.setData({ 
        ShopSelectPostion: this.data.ShopSelectPostion,
        ShowTitle: '店铺优惠',
        ShowContext: this.data.ShopInfoList.shop_discount
      })
    }
  },
  选择店铺地址: function (e) {
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.ShopInfoList.latitude),
      longitude: parseFloat(that.data.ShopInfoList.longitude),
      name: that.data.ShopInfoList.address_name,
      address: that.data.ShopInfoList.address_detail,
      scale: 28
    })
  },
  // 上拉加载更多
  onReachBottom: function () {
    console.log("上拉加载");
    wx.showNavigationBarLoading();
    this.data.PullUpRefreshStatus = true;
    this.data.current_page = this.data.current_page + 1;
    this.获取产品();
  },
  获取产品: function () {
    var that = this;
    wx.setNavigationBarTitle({ title: '产品管理' });
    console.log('store_code=' + that.data.FindStoreCode);
    wx.request({
      url: getApp().globalData.HomeUrl + getApp().globalData.GetProductsUrl,
      data: { "store_code": that.data.FindStoreCode, "current_page": that.data.current_page },
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
        else if (Ares.data.status_code == 605) {
          wx.showToast({ title: '无更多产品', })
          if (that.data.current_page < that.data.Max_page)
            that.data.Max_page = that.data.current_page;
          else
            that.data.current_page--;
        }
        else {
          wx.showModal({
            title: '接口错误',
            content: '获取产品接口错误' + Ares.data
          })
        }
        //--------加载条隐藏-------//
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (that.data.PullDownRefreshStatus || that.data.PullUpRefreshStatus) {
          that.data.PullUpRefreshStatus = false;
          that.data.PullDownRefreshStatus = false;
        }
      },
      fail: function () { 
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.showToast({ title: '获取产品失败,服务器异常', }) 
      }
    })
  },
  点击指定产品:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.numid;
    let productJson = JSON.stringify(that.data.ProductList[Index]);
    console.log(productJson);
    wx.navigateTo({ url: '/pages/ProductShow/productshow?productJson=' + productJson })
  }
})