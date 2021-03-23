import * as echarts from '../../ec-canvas/echarts';
const app=getApp()
function setOption(chart1,data) {//柱状图
  const option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '5%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: ['','','','','','','','','','','','','','','','','','','','','','','','',''], 
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
            data: data,
            color:"#F87628",
            barWidth : 5
        }
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
    time:"",//当日时间
    date:new Date().getTime(),//时间戳
    max:0,low:0,per:0,
    day:'',
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.Day(this.data.date);
    console.log(arr.xie)
    this.setData({
      time:arr.xie
    })
    this.get({
      day:arr.heng
    });
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
  zhoupressure:function(){
    wx.redirectTo({
      url: '../zhoupressure/zhoupressure'
    })
  },
  yuepressure:function(){
    wx.redirectTo({
      url: '../yuepressure/yuepressure'
    })
  },
  nianpressure:function(){
    wx.redirectTo({
      url: '../nianpressure/nianpressure'
    })
  },
  get:function(date){//获取数据
    // option1.series[0].data = []
    app.request('POST', '/yali_hour/',{day:date}, res => {
      console.log(res);
      if (res.data.code == 200) {
        console.log(res.data.data);
        let data=[{
          "id": 1,
          "device_id": "2",
          "max_data": 77,
          "low_data": 1,
          "per_data": 52,
          "nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 57,"nor_data": 22,
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
          "low_data": 2,
          "per_data": 56,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 58,"nor_data": 22,
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
          "low_data": 2,
          "per_data": 53,"nor_data": 22,
          "day": "2020-10-06"
        },
        {
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
          "low_data": 2,
          "per_data": 57,"nor_data": 22,
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
          "low_data": 2,
          "per_data": 56,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 58,"nor_data": 22,
          "day": "2020-10-06"
        },
        {
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
          "low_data": 2,
          "per_data": 57,"nor_data": 22,
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
          "low_data": 2,
          "per_data": 56,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 2,
          "low_data": 2,
          "per_data": 58,"nor_data": 22,
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
          "low_data": 2,
          "per_data": 53,"nor_data": 22,
          "day": "2020-10-06"
        },
        {
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
          "low_data": 2,
          "per_data": 56,"nor_data": 22,
          "day": "2020-10-06"
        },{
          "id": 1,
          "device_id": "2",
          "max_data": 82,
          "low_data": 36,
          "per_data": 58,"nor_data": 22,
          "day": "2020-10-06"
        }]
        let max=0,low=0,per=0;
        data.forEach((t,i)=>{
          t.max_data>max?max=t.max_data:max=max;
          if(low==0){
            low=t.low_data;
          }else{
            t.low_data<low?low=t.low_data:low=low;
          } 
        })
        per=Math.floor((max+low)/2);
        this.setData({max,low,per})
        // 饼图
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
        //柱状图
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
    let systemDate = new Date();  
      let year = systemDate.getFullYear();    
      let month = systemDate.getMonth() + 1; 
      let day =  systemDate.getDate();  
      let time2=year+'-'+month+'-'+day;
      console.log(time2)
      this.get(time2)
      this.setData({
        time:app.time(),
        day:time2
      })
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