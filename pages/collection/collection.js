// pages/collection/collection.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textData:[]//收藏文章
  },
  goDis:function(e){//跳转文章详情页
    wx.navigateTo({
      url: `../healthEncyclopediaDisck/healthEncyclopediaDisck?article_id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request('POST', '/my_fav/', {
      token:wx.getStorageSync('token'),
      page:1,
      limit:10
    }, res => {
      console.log(res);
      if (res.data.code == 200) {
        res.data.data.list.forEach(t => {
          t.creat_at=app.getTimer(parseInt(t.creat_at));
        });
        this.setData({
          textData:res.data.data.list
        })
      }
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