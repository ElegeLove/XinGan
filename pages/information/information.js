// pages/information/information.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gender:['男','女'],
    index:2,
    phoneToken:{},//token和phone
    name:"",//姓名
    sex:"",//性别
    born:"",//生日
    addr:""//地址
  },
  bindViewEvent:function(e){ 
    let sex=parseInt(e.detail.value)+1
    sex=String(sex);
    this.setData({sex})
 },
  goTwo:function(){//保存客户信息，跳转填写个人信息第二部
    if(this.data.name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }else if(this.data.sex == ''){
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return;
    }else if(this.data.born == ''){
      wx.showToast({
        title: '请输入出生日期',
        icon: 'none'
      })
      return;
    }
    app.request('POST', '/save_one/', {
      phone:this.data.phoneToken.phone,
      token:this.data.phoneToken.token,
      name:this.data.name,
      sex:this.data.sex,
      born:this.data.born,
      addr:this.data.addr
    }, res => {
      if (res.data.code == 200) {
          wx.navigateTo({
            url: `../information_physical/information_physical`,
          })
        }else{
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
    // console.log(options);
    // console.log(wx.getStorageSync('token'));
    let phoneToken = JSON.parse(options.data)
    this.setData({
      phoneToken
    })
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