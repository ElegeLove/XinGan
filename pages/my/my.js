// pages/my/my.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  AboutUs:function(){
    wx.navigateTo({
      url: '../AboutUs/AboutUs'
    })
  },
  collection:function(){
    wx.navigateTo({
      url: '../collection/collection'
    })
  },
  feedback:function(){
    wx.navigateTo({
      url: '../feedback/feedback'
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
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
    let data = {
      token:wx.getStorageSync('token'),
      nickname:userInfo.nickName,
      image:userInfo.avatarUrl,
    }
    app.request('POST', '/update_info/',data, ress => {
      if(ress.data.code == 200){
        
      }else{
        wx.showToast({
          title:  ress.data.msg,
          icon: 'none'
        })
      }
    })
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