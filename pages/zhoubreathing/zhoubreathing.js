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
    time:"",//周日期
    date:new Date().getTime(),//时间戳
    max:0,low:0,per:0,
    respiratory:{//心率范围
      min:0,//最小值
      max:0,//最大值
    },
    dataVal:0,//选中的数据
    weekVal:[]//一周的数据
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.weeks(this.data.date);
    this.setData({
      time:arr
    })
    this.getWeekData(arr.start);
    this.get({
      start:arr.startDateYear,
      end:arr.endDateYear
    })
  },
  after:function(){//后一周
    this.setData({
      date:this.data.date+24*60*60*1000*7
    })  
    this.af_be();
  },
  before:function(){//前一周
    this.setData({
      date:this.data.date-24*60*60*1000*7
    })  
    this.af_be();
  },
  heartRate:function(){//跳转心率
    wx.redirectTo({
      url: '../zhouheartRate/zhouheartRate'
    })
  },
  breathing:function(){//日心率
    wx.redirectTo({
      url: '../breathing/breathing'
    })
  },
  yuebreathing:function(){//月心率
    wx.redirectTo({
      url: '../yuebreathing/yuebreathing'
    })
  },
  nianbreathing:function(){//年心率
    wx.redirectTo({
      url: '../nianbreathing/nianbreathing'
    })
  },
  get:function(time,val){//页面数据获取
    app.request('POST', '/breath_day/', time, res => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res.data.data);
        let data1 = [];
        let timeArr = [];
        let max = 0;
        let per = 0;
        let low = 0;
        if(res.data.data.breath && res.data.data.breath.length > 0){
          low = parseInt(res.data.data.breath[0].per_data);
          res.data.data.breath.forEach(item => {
            per += parseInt(item.per_data);
            max = max > item.per_data ? max : item.per_data;
            low = low < item.per_data ? low : parseInt(item.per_data);
            //时间对应的数据
            this.data.weekVal.forEach(itemChild=>{
              if(itemChild.time == Date.parse(new Date(item.day))){
                itemChild.per = item.per_data;
              }
            })
          })
          this.setData({max:max.toFixed(0),low:low.toFixed(0),per:(per / res.data.data.breath.length).toFixed(0)})
            this.setData({
              dataVal:res.data.data.breath[res.data.data.breath.length-1].per_data.toFixed(0)
            })
        }else{
          this.setData({max,low,per:per,dataVal:0})
        }
        this.data.weekVal.forEach(items=>{
          timeArr.push(items.timeText)//时间
          data1.push(items.per);//数据
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
            data: timeArr//x轴数据
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
  // 获取周
  getWeekData:function(arr){
    let weekArr = [];
    for(let i = 0; i < 7; i++){
      let val = parseInt(arr) + (24*60*60*1000 * i);
      let obj = {
        time:val,
        timeText:app.noYear(new Date(val)),
        per:''
      }
      weekArr.push(obj)
    }
    this.setData({
      weekVal:weekArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr=app.zhouTime()
    console.log(arr)
    this.setData({
      time:arr
    })
    this.getWeekData(arr.start);
    this.get({
      start:arr.startDateYear,
      end:arr.endDateYear
    },'1')
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