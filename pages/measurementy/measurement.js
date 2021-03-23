// pages/mmeasurementy/measurement.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TI:[],//题目数组
    id:0,//选取题目下标
    an_id:"",//单个答案id
    ans_id:"",//答案id集合
    checked:false,//控制按钮是否选中
    a_id:[],//上一题id
  },
  value:function(e){//选中监听
    console.log(e.detail.value);
    this.setData({
      an_id:e.detail.value
    })
  },
  before:function(){//上一题
    let reg = new RegExp(/\d+,$/);
    let str = this.data.ans_id.replace(reg,"");
    let num = this.data.id - 1;
    console.log(str)
    this.setData({
      an_id:this.data.a_id[this.data.a_id.length-1],
      ans_id:str,
      id:num
    })
    let arr=this.data.a_id;
    arr.pop();
    this.setData({
      a_id:arr,
    })
    console.log(this.data.a_id);
    console.log(this.data.an_id);
    console.log(this.data.ans_id);
  },
  behind:function(e){//下一题
    if(this.data.an_id){
      let arr=this.data.a_id
      arr.push(this.data.an_id)
      let num =this.data.id + 1;
      this.setData({
        id:num,
        checked:false,
        a_id:arr,
        ans_id:this.data.ans_id+this.data.an_id+",",
        an_id:""
      })
      console.log(this.data.a_id);
      console.log(this.data.ans_id);
      // console.log(this.data.id)
    }
  },
  get:function(){//提交
    if(this.data.an_id){
      let arr=this.data.a_id
      arr.push(this.data.an_id)
      this.setData({
        a_id:arr,
        ans_id:this.data.ans_id+this.data.an_id
      })
      console.log(this.data.ans_id)
    }
    app.request('POST', '/commit_answer/', {
      token:wx.getStorageSync('token'),
      ans_id:this.data.ans_id
    }, res => {
      console.log(res);
      if (res.data.code == 200) {
        let data=JSON.stringify(res.data.data)
        wx.redirectTo({
          url: `../measurementySuss/measurementySuss?data=${data}`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request('POST', '/get_all_question/', {token:wx.getStorageSync('token')}, res => {
      if (res.data.code == 200) {
        this.setData({
          TI:res.data.data.list
        })
      }
      console.log(this.data.TI);
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