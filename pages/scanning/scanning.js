// pages/scanning/scanning.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // device_id:""
  },
  sao:function(){
    wx.scanCode({
      success: (res) => {
        let device_id=res.result.match(/^\w+:\d+/)[0];
        device_id=device_id.match(/\d+/)[0];
        // this.setData({device_id});
        app.request('POST', '/bind_device/', {
          token:wx.getStorageSync('token'),
          device_id
        }, res => {
            if (res.data.code == 200) {
              wx.redirectTo({
                url: '../scanning_successful/scanning_successful'
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
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