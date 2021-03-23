// pages/heartRate/heartRate.js
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
    dataVal:{//展示范围
      min:0,
      max:0
    },
    monthVal:[]//数据
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.month(this.data.date);
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
  breathing:function(){//跳转呼吸率
    wx.redirectTo({
      url: '../yuebreathing/yuebreathing'
    })
  },
  heartRate:function(){
    wx.redirectTo({
      url: '../heartRate/heartRate'
    })
  },
  zhouheartRate:function(){
    wx.redirectTo({
      url: '../zhouheartRate/zhouheartRate'
    })
  },
  nianheartRate:function(){
    wx.redirectTo({
      url: '../nianheartRate/nianheartRate'
    })
  },
  get:function(time,val){//页面数据获取
    app.request('POST', '/heart_day/', time, res => {
      if (res.data.code == 200) {
        let data1 = [];
        let data2 = [];
        let timeArr = [];
        let max = 0;
        let per = 0;
        let low = 0;
        if(res.data.data.heart && res.data.data.heart.length > 0){
          low = parseInt(res.data.data.heart[0].low_data);
          res.data.data.heart.forEach(item => {
            per += parseInt(item.per_data);
            max = max > item.max_data ? max : item.max_data;
            low = low < item.low_data ? low : item.low_data;
          })
          //时间对应的数据
          this.data.monthVal.forEach(it=>{
            res.data.data.heart.forEach(itChild=>{
              if(it.day == Date.parse(new Date(itChild.day))){
                it.min = itChild.low_data;
                it.max = itChild.max_data;
              }
            })
          })
          this.setData({max:max.toFixed(0),low:low.toFixed(0),per:(per / res.data.data.heart.length).toFixed(0)})
            this.setData({
              dataVal:{
                min:res.data.data.heart[res.data.data.heart.length-1].low_data.toFixed(0),
                max:res.data.data.heart[res.data.data.heart.length-1].max_data.toFixed(0)
              }
            })
        }else{
          this.setData({max,low,per:per})
        }
        this.data.monthVal.forEach(its=>{
          let num = 0;
          num = its.max - its.min;
          data1.push(its.min)//最小值的数组
          data2.push(num)//图形高度数组
          timeArr.push(its.dayTxt)
        })
        this.setData({respiratory: res.data.data.breath.breath_percent[0] ? res.data.data.breath.breath_percent[0].toFixed(0) : 0})
        this.init_one(data1,data2,timeArr);
      }
    })
  },
  init_one: function (data1,data2,timeArr) {           //饼图
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
            formatter(val) {//选中数据格式
              let minVal = '';
              let maxVal = '';
              if(val[0].value == 0){
                minVal = 0;
              }else if(val[0].value && val[0].value != ''){
                minVal = val[0].value;
              }
              if(val[1].value == 0){
                maxVal = minVal;
              }else if(val[1].value && val[1].value != ''){
                maxVal = val[0].value + val[1].value;
              }
              that.setData({
                dataVal:{
                  min:minVal==''?'':minVal.toFixed(0),
                  max:maxVal==''?'':maxVal.toFixed(0)
                }
              })
              return ``
            }
          },
          xAxis: {
            type: 'category',
            axisLabel:{
              interval : (timeArr.length-1)%2 != 0 ?parseInt((timeArr.length-1)/2.2):parseInt((timeArr.length-1)/2.1)
            },
            splitLine: {show: false},
            data: timeArr,//x轴时间数据
            axisTick:{
              show:false
            },
            axisLine:{
                show:false
            },
        },
        yAxis: {
            type: 'value',
            position:"right",
            axisTick:{
              show:false
            },
            axisLine:{
                show:false
            },
            nameTextStyle:{
              fontSize:26
            }
        },
        series: [
            {
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    itemStyle: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    }
                },
                data: data1//最小值数据数组
            },
            {
                name: '心率',
                type: 'bar',
                stack: '总量',
                barWidth : 6,
                data: data2,//高度数据数组
                color:"#F87628",
                itemStyle:{
                    emphasis:
                        {
                            barBorderRadius: 30
                        },
                        normal: {
                            barBorderRadius:[20, 20, 20, 20],
                               
                        }
                }
            }
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
  // 获取一个月的时间数据
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
        min:'',
        max:'',
        dayTxt:yue+'/'+num
      }
      monthList.push(obj)
    }
    this.setData({
      monthVal:monthList
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