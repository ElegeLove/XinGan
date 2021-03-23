//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    score:"",//分数
  },
  //事件处理函数
  measurement:function(){//跳转答题
    wx.navigateTo({
      url: '../measurementy/measurement',
    })
  },
  sleep:function(){//跳转睡眠
    wx.navigateTo({
      url: '../sleep/sleep',
    })
  },
  heartRate:function(){//跳转心率
    wx.navigateTo({
      url:'../heartRate/heartRate'
    })
  },
  hrv:function(){//跳转hrv
    wx.navigateTo({
      url:'../hrv/hrv'
    })
  },
  pressure:function(){//跳转压力
    wx.navigateTo({
      url:'../pressure/pressure'
    })
  },
  bindViewTap: function() {
   
  },
  onLoad: function () {
    app.request('POST', '/my_score/', {
      token:wx.getStorageSync('token')
    }, res => {
        if (res.data.code == 200) {
          let num = 100 - parseFloat(res.data.data);
          this.setData({
            score:num
          })
        }
      })
  },
  // onReady: function () {
  //   app.request('POST', '/my_score/', {
  //     token:wx.getStorageSync('token')
  //   }, res => {
  //       console.log(res);
  //       if (res.data.code == 200) {
  //         this.setData({
  //           score:res.data.data
  //         })
  //       }
  //     })
  // },
  getUserInfo: function(e) {
   
  }
})
