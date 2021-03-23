// pages/healthEncyclopediaDisck/healthEncyclopediaDisck.js
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comments:'',//评论内容
    PopupBool:true,//回复弹框
    Popup:"",//回复
    id:0,//点击回复评论id
    article_detail:{},//文章详情
    dis:[],//评论列表
    is_fav:'',//是否收藏
    article_id:'',//文章id
    one:[],//一级评论
  },
  cancelM:function(e){//取消回复
      this.setData({
        PopupBool: true,
      })
  },
 confirmM: function (e) {//发送回复
  console.log(e)
    app.request('POST', '/add_dis/', {
      token:wx.getStorageSync('token'),
      article_id:this.data.article_id,
      content:this.data.Popup,
      top_id:this.data.id
    }, res => {
      console.log(res);
      if (res.data.code == 200) {
        this.req();
        this.setData({
          PopupBool: true
        })
      }
    })
    // this.data.data[this.data.id].hui=this.data.Popup;
    // console.log(this.data.Popup);
 },
  Popup:function(event){//回复弹框
    console.log(event.target.dataset.id)
    this.setData({
      id:event.target.dataset.id,
      Popup:"",
      PopupBool:!this.data.PopupBool
    })
  },
  send:function(){//点击评论
    if(this.data.comments){
      console.log(this.data.comments)
      app.request('POST', '/add_dis/', {
        token:wx.getStorageSync('token'),
        article_id:this.data.article_id,
        content:this.data.comments,
        top_id:'0'
      }, res => {
        console.log(res);
        if (res.data.code == 200) {
          this.req();
          this.setData({
            comments:''
          })
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000
          }) 
        }
      })
    }else{
      wx.showToast({        
        title: '评论不能为空！',
        icon: 'none',
        duration: 1000
      })  
    }
  },
  collection:function(){//收藏
    this.setData({
      is_fav:!this.data.is_fav
    })
    let opt="";
    this.data.is_fav?opt='1':opt='0';
    app.request('POST', '/opt_fav/', {
      article_id:this.data.article_id,
      token:wx.getStorageSync('token'),
      opt
    }, res => {
      console.log(res);
      if (res.data.code == 200) {
        if(!this.data.is_fav){
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          }) 
        }else{
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          }) 
        }
      }
    })
  },
  req:function(){//详情页面加载
    app.request('POST', '/get_article_detail/', {article_id:this.data.article_id}, res => {
      console.log(res);
      if (res.data.code == 200) {
        let id=/img /g.exec(res.data.data.article_detail.content);
        if(id){
          id=id.index;
          let a=res.data.data.article_detail.content.slice(0,id+4);
          let b=res.data.data.article_detail.content.slice(id+4);
          res.data.data.article_detail.content=a+'style="max-width:100%; "'+b;
        }
        res.data.data.article_detail.creat_at=app.time(res.data.data.article_detail.creat_at);
        this.setData({
          article_detail:res.data.data.article_detail, 
          dis:res.data.data.dis,
          is_fav:res.data.data.is_fav
        })
        let one=[],two=[];
        this.data.dis.forEach(t=>{
          t.creat_at=app.getTimer(parseInt(t.creat_at+'000'));
          if(t.top_id==0){
            one.push(t);
          }else{
            two.push(t);
          }
        })
        one.forEach(t=>{
          two.forEach(item=>{
            if(t.id==item.top_id){
              t.uname=item.niciname;
              t.content1=item.content;
            }
          })
        })
        this.setData({one})
        console.log(one)
        console.log(two)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideKeyboard();
    console.log(121)
    console.log(options.article_id)
    this.setData({
      article_id:options.article_id
    })
    this.req();
  },
  onShow:function(){
    // wx.hideKeyboard();
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