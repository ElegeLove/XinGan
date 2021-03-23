// pages/detection/detection.js
const app = getApp();
let timeVal;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataVal: {
      heart: "",//心率
      breath: "",//呼吸率
    },
    heart: "",//心率
    breath: "",//呼吸率
    animation: '',
    lastTime:'0',
    isShow:true,
    timeList:[],
    status:1//状态
  },
  goScanning: function () {
    wx.navigateTo({
      url: '../scanning/scanning'
    })
  },
  // 获取数据
  getData: function (params) {
    this.setData({
      isShow:true
    })
    console.log(this.data.isShow)
    let that = this;
    app.request('POST', '/get_last_ticket/', {}, res => {
      if (res.data.code == 200) {
        that.setData({
          timeList:[]
        })
        let vals;
        //数组循环播放
        for(let i=0;i<res.data.data.last.length;i++){
          vals = setTimeout(()=>{
            if(that.data.isShow){
              that.animaEffect(res.data.data.last[i]);
              that.setData({
                lastTime:res.data.data.last_time
              })
              if(i == res.data.data.last.length -1){
                setTimeout(()=>{
                  that.getData()
                },2000)
              }
            }else{
              clearTimeout(vals)
            }
            
          },3000*i)
          that.data.timeList.push(vals)
        }
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
    let that = this;
    //创建动画
    this.animation = wx.createAnimation({
      transformOrigin: 'center center center center',
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
  },
  // 动画
  animaEffect: function (val) {
    let that = this;
    that.setData({ animation: that.animation.export() });
    that.animation.scale3d(0.9, 0.9, 0.9).step();
    setTimeout(() => {
      that.setData({
        heart: val.heart,//心率
        breath: val.breath//呼吸率
      })
      that.animation.scale3d(1.1, 1.1, 1.1).step();
      that.setData({ animation: that.animation.export() });
    }, 1000);
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
    let that = this;
      that.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //移出计时器
    this.setData({
      isShow:false
    })
    clearTimeout(timeVal)
    if(this.data.timeList.length > 0){
      this.data.timeList.forEach(item=>{
        clearTimeout(item)
      })
    }
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