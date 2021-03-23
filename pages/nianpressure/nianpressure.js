import * as echarts from '../../ec-canvas/echarts';
const app=getApp()
function setOption(chart1,data) {//柱状图
  const option1 = {
    tooltip: {
      trigger: 'axis'
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
       }
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
          data: data
      },
  ]
  };
  chart1.setOption(option1)
}
function setOption1(chart,data1,data2,data3,data4) {//饼图
  const option = {
    title:{
      text:'压力占比',
      x:"center",
      y:"center",
      left:'65',
      textStyle: {
        color: "#666666",
        fontWeight: 400,
        fontSize: 12
      }
    },
  backgroundColor:'rgba(255,255,255,1)',
  legend: {
      orient: 'vertical',
      top:40,
      right: 110,
      data: ['偏高 80-99', '中等 60-79','正常 30-59','放松 1-29'],
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
              {value: data1, name: '偏高 80-99'},
              {value: data2, name: '中等 60-79'},
              {value: data3, name: '正常 30-59'},
              {value: data4, name: '放松 1-29'},
          ],
          itemStyle: {
            normal: {
                color:function(params){
                    let colorList=[
                      '#F87628', '#FFE1CF','#AFE2FD','#C9EBFD'
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
  pressure:function(){
    wx.redirectTo({
      url: '../pressure/pressure'
    })
  },
  yuepressure:function(){
    wx.redirectTo({
      url: '../yuepressure/yuepressure'
    })
  },
  zhoupressure:function(){
    wx.redirectTo({
      url: '../zhoupressure/zhoupressure'
    })
  },
  get:function(time){//页面数据获取
    app.request('POST', '/yali_day/', time, res => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res.data.data);
        let data=[{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 52,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 57,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 54,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 56,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 58,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 54,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 53,"nor_data": 22,
          "day": "2020-10-06"
        },
        {
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 52,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 57,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 54,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 56,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,"nor_data": 22,
          "per_data": 58,
          "day": "2020-10-06"
        }]
        let max=0,low=0,per=0;
        data.forEach(t=>{
          t.max_data>max?max=t.max_data:max=max;
          if(low==0){
            low=t.low_data;
          }else{
            t.low_data<low?low=t.low_data:low=low;
          } 
        })
        per=Math.floor((max+low)/2);
        this.setData({max,low,per})
        //饼图
        let r1=0,r2=0,r3=0,r4=0;
        data.forEach(t=>{
          r1+=t.max_data;
          r2+=t.nor_data;
          r3+=t.per_data;
          r4+=t.low_data;
        })
        let num=r1+r2+r3+r4;
        let PI=(r)=>{
          let item=r/num*360;
          return item
        }
        r1=Math.floor(PI(r1));
        r2=Math.floor(PI(r2));
        r3=Math.floor(PI(r3));
        r4=Math.floor(PI(r4));
        this.init_one1(r1,r2,r3,r4)//
        let data2=[];
        data.forEach(t=>{
          data2.push(t.per_data);
        })
        this.init_one(data2)//
      }
    })
  },
  init_one: function (datasd) {           //柱状图
    this.oneComponent.init((canvas, width, height,dpr) => {
        const chart1 = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });
        setOption(chart1,datasd)
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
    let start=app.zhuan(arr.start);
    let end=app.zhuan(arr.end);
    this.get({
      start,end
    })
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