import * as echarts from '../../ec-canvas/echarts';
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    yue:"",//月份
    date:new Date().getTime(),//时间戳
    max:0,low:0,per:0,
    dataVal:0,//选中数据
    monthVal:[]//一个月的数据
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.month(this.data.date);
    console.log(arr)
    this.getMonths(arr.year,arr.yue)
    this.setData({
      yue:arr.yue
    })
    this.get({
      start:arr.startDate,
      end:arr.endDate
    })
  },
  after:function(){//后一周
    let yearVal = app.year(this.data.date).nian
    let monthVal = app.month(this.data.date).yue
    let dayVal = new Date(yearVal,monthVal,0).getDate();
    this.setData({
      date:this.data.date+24*60*60*1000*parseInt(dayVal)
    });
    this.af_be();
  },
  before:function(){//前一周
    let yearVal = app.year(this.data.date).nian
    let monthVal = app.month(this.data.date).yue -1
    let dayVal = new Date(yearVal,monthVal,0).getDate();
    this.setData({
      date:this.data.date-24*60*60*1000*parseInt(dayVal)
    })
    this.af_be();
  },
  heartRate:function(){//跳转心率
    wx.redirectTo({
      url: '../yueheartRate/yueheartRate'
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
  nianbreathing:function(){
    wx.redirectTo({
      url: '../nianbreathing/nianbreathing'
    })
  },
  get:function(time,val){//页面数据获取
    app.request('POST', '/breath_day/', time, res => {
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
            low = low < item.per_data ? low : item.per_data;
          })
          //时间对应的数据
          this.data.monthVal.forEach(it=>{
            res.data.data.breath.forEach(itChild=>{
              if(it.day == Date.parse(new Date(itChild.day))){
                it.per = itChild.per_data;
              }
            })
          })

          this.setData({max:max.toFixed(0),low:low.toFixed(0),per:(per / res.data.data.breath.length).toFixed(0)});
          // if(val == '1'){
            this.setData({
              dataVal:res.data.data.breath[res.data.data.breath.length-1].per_data.toFixed(0)
            })
          // }
        }else{
          this.setData({max,low,per:per,dataVal:0})
        }
        this.data.monthVal.forEach(its=>{
          data1.push(its.per)
          timeArr.push(its.dayTxt)
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
            trigger: 'axis',formatter(val) {//选中展示
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
            axisLabel:{
              interval : timeArr.length%2 != 0 ?parseInt(timeArr.length/2.1):parseInt(timeArr.length/2.2)
            },
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
  // 获取月
  getMonths:function(year,yue){
    let now = new Date(year,yue, 0);
    let dayCount = now.getDate();
    let monthList = [];
    for(let i = 0;i < dayCount;i++){
      let num = i + 1;
      if(num < 10){
        num = '0'+num;
      }
      let time = year + '-' + yue + '-' + num;
      let obj = {
        day:Date.parse(new Date(time)),
        per:'',
        dayTxt:yue+'/'+num
      }
      monthList.push(obj)
    }
    this.setData({
      monthVal:monthList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr=app.yueTime();
    this.getMonths(arr.year,arr.yue)
    this.get({
      start:arr.startDate,
      end:arr.endDate
    },'1')
    this.setData({
      yue:arr.yue
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