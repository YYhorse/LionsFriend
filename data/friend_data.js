//本地模拟朋友圈数据
var localData = {
  "status_code": 200,
  "friend_info": [
    {
      "title": "2018年3月聚会",
      "detail": "大家来一起聚聚",
      "time": "2018/3/1",
      "place":"大连长城饭店",
      "url": "http://img02.tooopen.com/images/20141231/sy_78327074576.jpg",
      "contact_name": "刘XX",
      "contact_tel": "18698711581",
      "activity_status": true
    },
    {
      "title": "测试A聚会",
      "detail": "大家来一起聚聚",
      "time": "2018/2/1",
      "place": "大连测试A饭店",
      "url": "http://img02.tooopen.com/images/20141231/sy_78327074576.jpg",
      "contact_name": "徐A先生",
      "contact_tel": "18698711581",
      "activity_status": false
    },
    {
      "title": "测试B聚会",
      "detail": "大家来一起聚聚",
      "time": "2018/1/1",
      "place": "大连测试B饭店",
      "url": "http://img02.tooopen.com/images/20141231/sy_78327074576.jpg",
      "contact_name": "徐B先生",
      "contact_tel": "18698711581",
      "activity_status": false
    },
    {
      "title": "测试C聚会",
      "detail": "大家来一起聚聚",
      "time": "2017/12/1",
      "place": "大连测试C饭店",
      "url": "http://img02.tooopen.com/images/20141231/sy_78327074576.jpg",
      "contact_name": "徐C先生",
      "contact_tel": "18698711581",
      "activity_status": false
    }
  ]
}

//定义数据出口
module.exports = {
  postList:localData
}

/*
{"status_code":200,"friend_info":[{"user_id":1,"title":"15:36","start_at":"2018-03-11 00:00:00","end_at":"2018-04-03 00:00:00","place":"辽宁省大连市甘井子区虹韵路1号","activity_state":"underway","detail":"测试","contact_name":"奥创","contact_number":"18698711581","activity_images":[{"current_url":"https://lionsshop.cn/uploads/activity_image/img_url/2/wx8289ef823b120966.o6zAJs9zMuO4UJGMEGveE_cR7jrM.8ffbaded5c6cd8bc89273e2ca2e95a14.jpg"}]}]}
*/