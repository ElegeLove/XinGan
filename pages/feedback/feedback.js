// pages/feedback/feedback.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",//联系方式
    value:''//反馈信息
  },
  behind:function(){//提交反馈
    console.log(this.data.value);
    if(this.data.phone&&this.data.value){
      app.request('POST', '/contact/', {
        token:wx.getStorageSync('token'),
        title:this.data.phone,
        content:this.data.value
      }, res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function () {
              wx.reLaunch({
              url: '../index/index',
                })
              }, 2000);
             }
          }) 
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})