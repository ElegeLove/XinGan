// pages/heartRate/heartRate.js
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
    max:0,low:0,per:0,
    dataVal:{//心率选中范围
      min:0,
      max:0
    },
    yearVal:[]//一年的数据
  },
  af_be:function(){//前一天后一天获取信息
    let arr=app.year(this.data.date);
    let start=app.zhuan(arr.start);
    let end=app.zhuan(arr.end);
    this.setData({
      nian:arr.nian
    })
    this.get({
      start,end
    })
  },
  after:function(){//后一周
    this.setData({
      date:this.data.date+24*60*60*1000*365
    })  
    this.af_be();
  },
  before:function(){//前一周
    this.setData({
      date:this.data.date-24*60*60*1000*365
    })  
    this.af_be();
  },
  breathing:function(){//跳转呼吸率
    wx.redirectTo({
      url: '../nianbreathing/nianbreathing'
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
  yueheartRate:function(){
    wx.redirectTo({
      url: '../yueheartRate/yueheartRate'
    })
  },
  get:function(time,val){//页面数据获取
    app.request('POST', '/heart_day/', time, res => {
      if (res.data.code == 200) {
        let yearList = [];
        for(let i = 0;i < 12;i++){
          let obj = {
            month:i+1,
            min:'',
            max:''
          }
          yearList.push(obj);
        }
        this.setData({
          yearVal:yearList
        })
        let data1 = [];
        let data2 = [];
        let timeArr = [];
        let max = 0;
        let per = 0;
        let low = 0;
        if(res.data.data.heart && res.data.data.heart.length > 0){
          let arrVal = [];
          this.data.yearVal.forEach(item=>{
            res.data.data.heart.forEach(itemChild=>{
              itemChild.dayVal = Date.parse(new Date(itemChild.day))
              itemChild.month = new Date(itemChild.day).getMonth() + 1;
              //时间对应的数据
              if(item.month == itemChild.month){
                if(item.max == ''){
                  item.max = itemChild.max_data
                }else if(item.max < itemChild.max_data){
                  item.max = itemChild.max_data;
                }
                if(item.min == ''){
                  item.min = itemChild.low_data
                }else if(item.min > itemChild.low_data){
                  item.min = itemChild.low_data;
                }
              }
            })
            
          })
          low = parseInt(res.data.data.heart[0].low_data);
          res.data.data.heart.forEach(item => {
            per += parseInt(item.per_data);
            max = max > item.max_data ? max : item.max_data;
            low = low < item.low_data ? low : item.low_data;
          })
          this.setData({max:max.toFixed(0),low:low.toFixed(0),per:(per / res.data.data.heart.length).toFixed(0)})
            this.setData({
              dataVal:{
                min:res.data.data.heart[res.data.data.heart.length-1].low_data.toFixed(0),
                max:res.data.data.heart[res.data.data.heart.length-1].max_data.toFixed(0)
              }
            })
        }else{
          this.setData({max,low,per:per,dataVal:{
            min:0,
            max:0
          }})
        }
        this.data.yearVal.forEach(it=>{
          let num = 0;
          num = it.max - it.min;
          data1.push(it.min);//最小值
          data2.push(num);//图形高度
          timeArr.push(it.month);//x轴时间数据
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
            formatter(val) {//选中范围格式展示
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
            splitLine: {show: false},
            data: timeArr,//x轴数据
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
                data: data2,//图形高度数组
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
    let arr=app.nianTime();
    let start=app.zhuan(arr.start);
    let end=app.zhuan(arr.end);
    this.get({
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