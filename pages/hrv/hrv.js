// pages/hrv/hrv.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    res:{},//返回hrv数据
    sdnnCss:'',//sdnn三角形位置
    rmssdCss:'',//rmssd三角形位置
    lfCss:'',//if三角形位置
    hfCss:'',//hf三角形位置
    sd1sd2Css:'',//sd2三角形位置
    time:"",//日期
    date:new Date().getTime(),//时间戳
  },
  /**
   * 生命周期函数--监听页面加载
   */
  af_be:function(){//前一天后一天获取信息
    let arr=app.Day(this.data.date);
    console.log(arr.xie)
    this.setData({
      time:arr.xie
    })
    this.get({
      token:wx.getStorageSync('token'),
      day:arr.heng
    })
  },
  after:function(){//后一天
    this.setData({
      date:this.data.date+24*60*60*1000
    })  
    this.af_be();
  },
  before:function(){//前一天
    this.setData({
      date:this.data.date-24*60*60*1000
    })  
    this.af_be();
  },
  get:function(date){//获取数据
    app.request('POST', '/get_last_hrv/', date, res => {
      console.log(res.data);
      // 测试数据
      if (res.data.code == 200) {
        console.log(res.data.data.sdnn);
        let data={
          "sdnn": 66,
          "rmssd": 77,
          "lf": 250,
          "hf": 890,
          "sd1sd2": 0.45,
          "day": "2020-11-06"
        }
        let sdnnCss=Math.floor((data.sdnn)/125*379);
        let rmssdCss=Math.floor((data.rmssd)/94*379);
        let lfCss=Math.floor((data.lf)/883*379);
        let hfCss=Math.floor((data.hf)/3460*379);
        let sd1sd2Css=Math.floor((data.sd1sd2)/0.88*379);
        this.setData({
          sdnnCss,rmssdCss,lfCss,hfCss,sd1sd2Css,res:data
        })
        // let sdnnCss=Math.floor((res.data.data.sdnn)/125*379);
        // let rmssdCss=Math.floor((res.data.data.rmssd)/94*379);
        // let lfCss=Math.floor((res.data.data.lf)/883*379);
        // let hfCss=Math.floor((res.data.data.hf)/3460*379);
        // let sd1sd2Css=Math.floor((res.data.data.sd1sd2)/0.88*379);
        // this.setData({
        //   sdnnCss,rmssdCss,lfCss,hfCss,sd1sd2Css,res:res.data.data
        // })
        console.log(sdnnCss,rmssdCss,lfCss,hfCss,sd1sd2Css)
      }
    })
  },
  onLoad: function (options) {//获取hrv数据
    this.setData({
      time:app.time()
    })
    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();
    let time=year+'-'+month+'-'+day;
    this.get({
      token:wx.getStorageSync('token'),
      day:time
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