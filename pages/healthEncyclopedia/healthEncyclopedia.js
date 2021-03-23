// pages/healthEncyclopedia/healthEncyclopedia.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
        navData:[],//导航分类
        currentTab: 0,//判断选中变色
        navScrollLeft: 0,
        textData:[]//文章信息
  },
  switchNav(event){//导航点击事件
    let that=this;
      console.log(event);
      let cur = event.currentTarget.dataset.current; //导航下标
      let type_id=event.target.dataset.type_id;
      app.request('POST', '/get_article_list/', {
        limit:10,
        page:1,
        type_id
      }, res => {
        console.log(res);
        if (res.data.code == 200) {
          console.log(res);
          this.setData({
            currentTab: cur,
            textData:res.data.data.list
          })
          let arr=this.data.textData;
          this.data.textData.forEach((t,i) => {
            let time=app.getTimer(t.creat_at);
            arr[i].creat_at=time;
          });
          that.setData({
            textData:arr
          })
        }
      })
  },
  goDis(e){//进入新闻详情
    console.log(e);
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `../healthEncyclopediaDisck/healthEncyclopediaDisck?article_id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//获取页面信息
    let that=this;
    console.log(1212)
    app.request('POST', '/get_all_tag/', {}, res => {//获取文章分类
      console.log(res);
      if (res.data.code == 200) {
        this.setData({
          navData:res.data.data
        })
        console.log(res.data.data)
        app.request('POST', '/get_article_list/', {//获取文章信息
          limit:10,
          page:1,
          type_id:res.data.data[0].id
        }, res => {
          console.log(res);
          if (res.data.code == 200) {
            this.setData({
                textData:res.data.data.list
            })
            let arr=this.data.textData;
            this.data.textData.forEach((t,i) => {
              let time=app.getTimer(t.creat_at);
              arr[i].creat_at=time;
            });
            that.setData({
              textData:arr
            })
          }
          console.log(this.data.textData)
        })
      }
      console.log(this.data.navData);
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