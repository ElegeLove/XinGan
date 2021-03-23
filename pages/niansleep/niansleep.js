// pages/niansleep/niansleep.js
import * as echarts from '../../ec-canvas/echarts';
const app=getApp()
function setOption(chart1,data1,data2) {//柱状图
  const option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisTick:{
            show:false
        },
       
    },
    yAxis: {
        type: 'value',
        show:false
    },
    series: [
        {
            name: '日均深睡',
            type: 'bar',
            stack: '总量',
            label: {
                position: 'insideRight'
            },
            data: data1,
            color:"#F87628"
        },
        {
            name: '日均浅睡',
            type: 'bar',
            stack: '总量',
            label: {
                position: 'insideRight'
            },
            data: data2,
            color:"#FFE1CF"
        },
        {
          name: '快速眼动',
          type: 'bar',
          stack: '总量',
          data: data1,
          color:'#86b7e0'
      },
      {
          name: '清醒',
          type: 'bar',
          stack: '总量',
          data: data2,
          color: '#a6cf8b'
      },
    ]
  };
  chart1.setOption(option1)
}
function setOption1(chart,list,data1,data2) {//饼图
  const option = {
    legend:{
      z:2
    },
    title:{
      text:'睡眠比例',
      x:"center",
      y:"center",
      left:'65',
      textStyle: {
        color: "#666666",
        fontWeight: 400,
        fontSize: 12
      }
    },
  backgroundColor:'white',
  legend: {
      orient: 'vertical',
      top:70,
      right: 50,
      // data: ['浅睡眠', '深度睡眠'],
  },
  series: [
      {
          fontSize: 1 ,
          name: '访问来源',
          type: 'pie',
          radius: ['65%', '35%'],
          center: ['25%', '50%'],
          avoidLabelOverlap: true,
          clickable:false,　
          hoverAnimation:false,
          label: {
              show: false,
              position: 'center'
          },
          emphasis: {
              label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
              }
          },
          labelLine: {
              show: false
          },
          data: [
            {value: data1, name: `浅睡眠：${list.qian}`},
            {value: data2, name: `深度睡眠：${list.shen}`},
            {value: data1, name: `快速眼动：${list.dong}`},
            {value: data2, name: `清醒：${list.xing}`},
          ],
          itemStyle: {
            normal: {
                color:function(params){
                    let colorList=[
                      '#F87628', '#FFE1CF','#86b7e0', '#a6cf8b'
                  ];
                return colorList[params.dataIndex]
                },
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0)'
            }
        },
      }
  ]
  };
  chart.setOption(option)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {//饼图
      lazyLoad: true
    },
    ee:  {//柱状图
      lazyLoad: true
    },
    nian:"",//当前年
    list:{
      shen:"3时45分",
      qian:"4时15分",
      dong:"5时05分",
      xing:"6时25分",
    },
    date:new Date().getTime(),//时间戳
    max:0,low:0,per:0,
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
  zhousleep:function(){
    wx.redirectTo({
      url: '../zhousleep/zhousleep'
    })
  },
  yuesleep:function(){
    wx.redirectTo({
      url: '../yuesleep/yuesleep'
    })
  },
  sleep:function(){
    wx.redirectTo({
      url: '../sleep/sleep'
    })
  },
  get:function(time){
    app.request('POST', '/sleep_day/', time, res => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res.data.data);
        let data1=[4, 5, 4.3, 4.6, 4.7, 5.2, 4.4, 5, 4.3, 4.6, 4.7, 5.2];
        let data2=[1, 16, 5.3, 7.4, 6.2, 7, 6.8, 7, 6.3, 6.4, 6.2, 7];
        this.init_one(data1,data2);
        this.init_one1(this.data.list,150,210);
      }
    })
  },
  init_one: function (data1,data2) {           //柱状图
    this.oneComponent.init((canvas, width, height,dpr) => {
        const chart1 = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });
        setOption(chart1,data1,data2)
        this.chart1 = chart1;
        return chart1;
    });
  },
  init_one1: function (data1,data2,data3,data4) {           //饼图
    this.oneComponent1.init((canvas, width, height,dpr) => {
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });
        setOption1(chart,data1,data2,data3,data4)
        this.chart = chart;
        return chart;
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.nianTime())
    let arr=app.nianTime();
    this.get({
      start:arr.start,
      end:arr.end
    });
    this.setData({
      nian:arr.nian
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.oneComponent = this.selectComponent('#mychart-dom-bar');  
    this.oneComponent1 = this.selectComponent('#mychart-dom');  
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