import * as echarts from '../../ec-canvas/echarts';
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    nian:"",//当前年
    date:new Date().getTime(),//时间戳
    max:0,low:0,per:0,dataVal:0,yearVal:[]
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.year(this.data.date);
    let start=app.zhuan(arr.start);
    let end=app.zhuan(arr.end);
    console.log(arr)
    this.setData({
      nian:arr.nian
    })
    this.get({
      start,end
    })
  },
  after:function(){//后一周
    console.log(this.data.date)
    this.setData({
      date:this.data.date+24*60*60*1000*365
    })  
    this.af_be();
  },
  before:function(){//前一周
    console.log(this.data.date)
    this.setData({
      date:this.data.date-24*60*60*1000*365
    })  
    this.af_be();
  },
  heartRate:function(){//跳转心率
    wx.redirectTo({
      url: '../nianheartRate/nianheartRate'
    })
  },
  breathing:function(){//日心率
    wx.redirectTo({
      url: '../breathing/breathing'
    })
  },
  zhoubreathing:function(){
    wx.redirectTo({
      url: '../zhoubreathing/zhoubreathing'
    })
  },
  yuebreathing:function(){
    wx.redirectTo({
      url: '../yuebreathing/yuebreathing'
    })
  },
  get:function(time,val){//页面数据获取
    app.request('POST', '/breath_day/',time, res => {
      if (res.data.code == 200) {
        let yearList = [];
        for(let i = 0;i < 12;i++){
          let obj = {
            month:i+1,
            per:'',
          }
          yearList.push(obj);
        }
        this.setData({
          yearVal:yearList
        })
        let data1 = [];
        let timeArr = [];
        let max = 0;
        let per = 0;
        let low = 0;
        if(res.data.data.breath && res.data.data.breath.length > 0){
          let arrVal = [];
          this.data.yearVal.forEach(item=>{
            res.data.data.breath.forEach(itemChild=>{
              itemChild.dayVal = Date.parse(new Date(itemChild.day))
              itemChild.month = new Date(itemChild.day).getMonth() + 1;
              //时间对应的数据
              if(item.month == itemChild.month){
                item.per = itemChild.per_data;
              }
            })
          })

          low = parseInt(res.data.data.breath[0].per_data);
          res.data.data.breath.forEach(item => {
            per += parseInt(item.per_data);
            max = max > parseInt(item.per_data) ? max : parseInt(item.per_data);
            low = low < parseInt(item.per_data) ? low : parseInt(item.per_data);
          })
          this.setData({max,low,per:(per / res.data.data.breath.length).toFixed(0)})
            this.setData({
              dataVal:res.data.data.breath[res.data.data.breath.length-1].per_data.toFixed(0)
            })
        }else{
          this.setData({max,low,per:per,dataVal:0})
        }
        this.data.yearVal.forEach(it=>{
          // if(it.per == ''){
          //   it.per = 0;
          // }
          data1.push(it.per);
          timeArr.push(it.month);
        })
        this.setData({
          respiratory:{
            max:res.data.data.heart.percent_heart.max?res.data.data.heart.percent_heart.max.toFixed(0):0,
            min:res.data.data.heart.percent_heart.min?res.data.data.heart.percent_heart.min.toFixed(0):0
          }
        })
        this.init_one(data1,timeArr);
      }
    })
  },
  init_one: function (data,timeArr) {           //饼图
    let that = this;
    this.oneComponent.init((canvas, width, height,dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });
        const option = {
          tooltip: {
            trigger: 'axis',
            formatter(val) {//选中展示
              let num = '';
              if(val[0].value == 0){
                num = 0;
              }else if(val[0].value && val[0].value != ''){
                num = val[0].value.toFixed(0);
              }
              that.setData({
                dataVal:num==''?'':num
              })
              return ``
            }
        },
        toolbox: {
            show: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick:{
                 show:false
             },
             axisLine:{
                 show:false
             },
            data: timeArr,//x轴时间数据
        },
        yAxis: {
             type: 'value',
             nameLocation:'end',
             max:99,
             axisTick:{
                 show:false
             },
             axisLine:{
                 show:false
             },
             position:"right"
        },
        series: [
            {
                color:"#F87628",
                name: '压力',
                type: 'line',
                data: data//数据
            },
        ]
        };
        chart.setOption(option)
        this.chart = chart;
        return chart;
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前年份
    let arr=app.nianTime();
    let start=app.zhuan(arr.start);
    let end=app.zhuan(arr.end);
    this.get( {
      start,end
    },'1')
    this.setData({
      nian:arr.nian
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.oneComponent = this.selectComponent('#mychart-dom-bar');  
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