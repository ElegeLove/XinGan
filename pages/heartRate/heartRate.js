// pages/heartRate/heartRate.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    time: "",//当日时间
    date: new Date().getTime(),//时间戳
    timeVal: {
      timeArr: [],//时间
      dataArr: [],//数据
    },
    respiratory: 0,//呼吸率
    sum_pre: 0,//平均值
    maxVal: 0,//最大值
    minVal: 0,//最小值
    dataVal: 0,//选中的数据
    timeList:[],//数据
    dataList:[],//时间
  },
  af_be: function () {//前一天后一天获取信息
    let arr = app.Day(this.data.date);
    this.setData({
      time: arr.xie
    })
    this.get({
      day: arr.heng,
      token: wx.getStorageSync('token')
    });
  },
  after: function () {//后一天
    this.setData({
      date: this.data.date + 24 * 60 * 60 * 1000
    })
    this.af_be();
  },
  before: function () {//前一天
    this.setData({
      date: this.data.date - 24 * 60 * 60 * 1000
    })
    this.af_be();
  },
  breathing: function () {//跳转呼吸率
    wx.redirectTo({
      url: '../breathing/breathing'
    })
  },
  zhouheartRate: function () {//周心率
    wx.redirectTo({
      url: '../zhouheartRate/zhouheartRate'
    })
  },
  yueheartRate: function () {//月心率
    wx.redirectTo({
      url: '../yueheartRate/yueheartRate'
    })
  },
  nianheartRate: function () {//年心率
    wx.redirectTo({
      url: '../nianheartRate/nianheartRate'
    })
  },
  get: function (date) {//获取数据
    this.createData();
    app.request('POST', '/heart_min/', date, res => {
      if (res.data.code == 200) {
        let arr = [];
        let timeArr = [];
        let max = 0;
        let min = 0;
        let sum_pre = 0;
        if (res.data.data.heart && res.data.data.heart.length > 0) {
          min = parseInt(res.data.data.heart[0].per_data);
          res.data.data.heart.forEach(item => {
            sum_pre += parseInt(item.per_data);//总平均数
            max = max > parseInt(item.per_data) ? max : parseInt(item.per_data);//最大值
            min = min < parseInt(item.per_data) ? min : parseInt(item.per_data);//最小值
            // 时间格式转换
            let time = parseInt(item.minute_time_stamp) * 1000
            let date = new Date(time);
            let h = date.getHours();
            let minute = date.getMinutes();
            let sumTime = parseInt(h)*60 + parseInt(minute);
            // 时间对应的数据
            this.data.timeList.some(itemChild=>{
              if(parseInt(sumTime) < parseInt(itemChild.num)){
                itemChild.val = item.per_data;
                return true;
              }
            })
          });
          this.data.timeList.forEach(item=>{
            arr.push(item.val)
          })
          this.setData({
            sum_pre: (sum_pre / res.data.data.heart.length).toFixed(0),
            maxVal: max,
            minVal: min,
            timeVal: {
              timeArr: this.data.dataList,  //时间
              dataArr: arr  //数据
            },
            respiratory: res.data.data.breath.per_data ? res.data.data.breath.per_data.toFixed(0) : 0 //呼吸率
          })
        } else {
          this.data.timeList.forEach(item=>{
            arr.push(item.val)
          })
          this.setData({
            sum_pre: sum_pre,
            maxVal: max,
            minVal: min,
            timeVal: {
              timeArr: this.data.dataList,  //时间
              dataArr: arr  //数据
            },
            respiratory: res.data.data.breath.per_data ? res.data.data.breath.per_data.toFixed(0) : 0
          })
        }
        this.init_one(this.data.timeVal);
      }
    })
  },
  init_one: function (timeVal) {           //饼图
    let that = this;
    // 初始化图表
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter(val) {//选中展示
            let vals = '';
            if(val[0].value && val[0].value != ''){
              if(val[0].value == 0){
                vals = 0;
              }else{
                vals = val[0].value.toFixed(0);
              }
            }
            that.setData({
              dataVal:vals
            })
            return ``
          }
        },
        grid: {
          bottom: 50
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: [0],
        }, {
          type: 'slider',
          show: false
        }],
        xAxis: {
          axisLabel:{
            interval : parseInt((timeVal.timeArr.length-1)/4.1),//x轴格式展示
          },
          data: timeVal.timeArr,//x轴数据
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '心率',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: '#F3DF62'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FFEDEB'
              }, {
                offset: 1,
                color: '#FFEDEB'
              }])
            },
            data: timeVal.dataArr,//数据
          }
        ]
      };
      chart.setOption(option)
      this.chart = chart;
      return chart;
    });
  },
  // 获取一天的间隔10分钟的所有时间
  createData:function(){
    let xData = 24*60/10;
    let arr = [{num:0,val:'0'}];
    let num = 0;
    for(let i = 0; i < xData; i++){
      num = num + 10
      let obj = {
        num:num,
        val:''
      }
      arr.push(obj);
    }
    let arr1 = [];
    let hTime = 0;
    let dTime = 0;
    let timeVal = '';
    arr.forEach(item=>{
      if(item.num <= 60){
        hTime = 0;
        dTime = item.num;
      }else{
        hTime = Math.floor(item.num / 60);
        dTime = item.num - (hTime*60)
      }
      if(hTime < 10){
        hTime = '0'+hTime;
      }
      if(dTime < 10){
        dTime = '0'+dTime;
      }
      timeVal = hTime + ':' + dTime;
      arr1.push(timeVal)
    })
    this.setData({
      timeList:arr,//数据
      dataList:arr1,//时间
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始展示选中数据
    app.request('POST', '/get_last_ticket/', {}, res => {
      if (res.data.code == 200) {
        this.setData({
          dataVal:res.data.data.heart
        })
      }
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
    // 获取当前时间
    let systemDate = new Date();
    let year = systemDate.getFullYear();
    let month = systemDate.getMonth() + 1;
    let day = systemDate.getDate();
    let time2 = year + '-' + month + '-' + day;
    this.get({
      day: time2,
      token: wx.getStorageSync('token')
    });
    this.setData({
      time: app.time()
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