// pages/information_physical/information_physical.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:"",
    weight:"",
    his:"",
    userInfo:{}
  },
  onGotUserInfo: function (e) {
    console.log(e)
    if(e.detail.userInfo){
      this.setData({
        userInfo:e.detail.userInfo
      })
      wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo))
      let data = {
        token:wx.getStorageSync('token'),
        nickname:this.data.userInfo.nickName,
        image:this.data.userInfo.avatarUrl,
      }
      app.request('POST', '/update_info/',data, ress => {
        if(ress.data.code == 200){
          if(this.data.height == ''){
            wx.showToast({
              title: '请输入身高',
              icon: 'none'
            })
            return;
          }else if(this.data.weight == ''){
            wx.showToast({
              title: '请输入体重',
              icon: 'none'
            })
            return;
          }else if(this.data.his == ''){
            wx.showToast({
              title: '请输入病史',
              icon: 'none'
            })
            return;
          }
          app.request('POST', '/save_two/', {//保存客户信息，跳转扫码绑定
            token:wx.getStorageSync('token'),
            height:this.data.height,
            weight:this.data.weight,
            his:this.data.his
          }, res => {
            if (res.data.code == 200) {
                wx.navigateTo({
                  url: `../scanning/scanning`,
                })
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            })
        }else{
          wx.showToast({
            title:  ress.data.msg,
            icon: 'none'
          })
        }
      })
    }else{
      wx.showToast({
        title:  '请授权登录',
        icon: 'none'
      })
    }
    
   },
  // Ok(){
  //   // console.log(this.data.height,this.data.weight,this.data.his)
    
  // },
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