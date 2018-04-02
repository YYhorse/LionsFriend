// var SearchTempList = [{ "store_code": "00010010", "service_state": "wait_for_audit", "service_name": "测试业务911", "service_place": "{\"address_name\":\"西安路\",\"address_detail\":\"辽宁省大连市沙河口区\",\"latitude\":\"38.91502\",\"longitude\":\"121.58779\"}", "address_name": "西安路", "address_detail": "辽宁省大连市沙河口区", "latitude": "38.91502", "longitude": "121.58779", "service_detail": "测试", "contact_name": "测试", "contact_tel": "18698711581", "picinfo": [{ "current_url": "https://lionsshop.cn/uploads/store_image/img_url/14/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.ab79af2c2065cdb7a7707a93e156feda.jpg" }] }, { "store_code": "00010008", "service_state": "audit_success", "service_name": "测试大数据标题标题标题", "service_place": "{\"address_name\":\"家乐福(黄河店)\",\"address_detail\":\"辽宁省大连市沙河口区黄河路665\",\"latitude\":\"38.91121\",\"longitude\":\"121.58859\"}", "address_name": "家乐福(黄河店)", "address_detail": "辽宁省大连市沙河口区黄河路665", "latitude": "38.91121", "longitude": "121.58859", "service_detail": "主要销售测试测试大数据测试详情详情用，数据长数据长数据长数据长数据长测试用的。", "contact_name": "刘X", "contact_tel": "0411-86935451", "picinfo": [{ "current_url": "https://lionsshop.cn/uploads/store_image/img_url/8/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.8bf9d8c7919d308d2fd0a73729b0acf5.jpg" }] }, { "store_code": "00010009", "service_state": "wait_for_audit", "service_name": "测试业务A0", "service_place": "{\"address_name\":\"中关村\",\"address_detail\":\"北京市海淀区中关村\",\"latitude\":\"39.980484\",\"longitude\":\"116.311302\"}", "address_name": "中关村", "address_detail": "北京市海淀区中关村", "latitude": "39.980484", "longitude": "116.311302", "service_detail": "测试", "contact_name": "测试", "contact_tel": "18698711581", "picinfo": [{ "current_url": "https://lionsshop.cn/uploads/store_image/img_url/13/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.0c4c77844715469264b0ff4aa853c79d.jpg" }] }];
Page({
  data: {
    SearchInfoList: null,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '业务搜索' });
    let tempList = JSON.parse(options.SearchServiceJson);
    // let tempList = SearchTempList;
    this.setData({
      SearchInfoList: tempList
    })
  },
  点击指定业务: function (e) {
    var Index = e.currentTarget.dataset.numid;
    let MyServiceJson = JSON.stringify(this.data.SearchInfoList[Index]);
    wx.navigateTo({ url: '/pages/HelpDetailActivity/helpdetail?MyServiceJson=' + MyServiceJson })
  },
})