//app.js
App({
  // APPID：wx826921572a644b80  //正式
  // APPID：wx81cd843d32df9e7f  //测试
  request: function (_methods, url, data, callback) {//封装请求
    // data.token = '216dffa0979080a4732eb55ef31feec5';
    data.token = wx.getStorageSync('token');
    let host = "https://www.sengain.top";
    wx.request({
      url: host + url,
      method: _methods,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
      dataType: 'json',
      success: (res) => {
        if (res.data.code == 401) {
          wx.showToast({
            title: '请登录',
            icon: 'none'
          })
          wx.removeStorageSync('token')
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/logs/logs',
            })
          }, 1000)
        } else {
          typeof callback == "function" && callback(res, "");
        }
      },
      fail: (err) => {
        typeof callback == "function" && callback(err, "");
      }
    });
  },
  transferDate: function (date) {  //带年日期转换方法
    // 年  
    var year = date.getFullYear();
    // 月  
    var month = date.getMonth() + 1;
    // 日  
    var day = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var dateString1 = year + '/' + month + '/' + day;
    var dateString2 = year + '-' + month + '-' + day;
    let dateString = { dateString1, dateString2 }
    return dateString;
  },
  noYear: function (date) {  //不带年日期转换方法
    // 月  
    var month = date.getMonth() + 1;
    // 日  
    var day = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var noYear = + month + '/' + day;
    return noYear;
  },
  time: function () {//当日时间
    var systemDate = new Date();
    // 获取当年  
    var year = systemDate.getFullYear();
    // 获取当月 （月+1是因为js中月份是按0开始的）  
    var month = systemDate.getMonth() + 1;
    // 获取当日  
    var day = systemDate.getDate();
    if (day < 10) { // 如果日小于10，前面拼接0  
      day = '0' + day;
    }
    if (month < 10) { // 如果月小于10，前面拼接0 
      month = '0' + month;
    }
    return [year, month, day].join('/');
  },
  zhouTime: function () {//本周时间
    //按周日为一周的最后一天计算  
    var date = new Date();
    //今天是这周的第几天  
    var today = date.getDay();
    //上周日距离今天的天数（负数表示）  
    var stepSunDay = -today + 1;
    // 如果今天是周日  
    if (today == 0) {
      stepSunDay = -7;
    }
    // 周一距离今天的天数（负数表示）  
    var stepMonday = 7 - today;
    var time = date.getTime();
    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
    //本周一的日期 （起始日期）  
    var startDateYear = this.transferDate(monday).dateString2; // 日期变换  
    //本周日的日期 （结束日期）  
    var endDateYear = this.transferDate(sunday).dateString2; // 日期变换 
    //本周一的日期 （起始日期）  
    var startDate = this.noYear(monday); // 日期变换  
    //本周日的日期 （结束日期）  
    var endDate = this.noYear(sunday); // 日期变换  
    let start = new Date(startDateYear).getTime()
    let end = new Date(endDateYear).getTime()
    let zhouTime = startDate + ' - ' + endDate
    let zhouTimes = startDateYear + ' 至 ' + endDateYear
    let arr = {
      start, end, zhouTime,zhouTimes, startDateYear, endDateYear
    }
    return arr;
  },
  yueTime: function () {//本月时间
    // 获取当前月的第一天  
    var start = new Date();
    let year = start.getFullYear();
    let yue = start.getMonth() + 1;
    start.setDate(1);
    // 获取当前月的最后一天  
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var end = new Date(nextMonthFirstDay - oneDay);
    var startDate = this.transferDate(start).dateString2; // 日期变换  
    var endDate = this.transferDate(end).dateString2; // 日期变换  
    let tstart = new Date(start).getTime()
    let tend = new Date(end).getTime()
    console.log(year)
    let arr = {
      start: tstart,
      end: tend,year,
      yue, startDate, endDate
    }
    return arr;
  },
  nianTime: function () {//今年时间
    const d = new Date();
    let nian = d.getFullYear()
    const d1 = new Date(d.setFullYear(d.getFullYear()));
    let t = new Date(new Date(d1.setDate(1)).setHours(0, 0, 0, 0));
    let t1, t2 = 0;
    t1 = t.setMonth(0);
    const d2 = new Date(t1);
    t2 = new Date(d2.setFullYear(d2.getFullYear() + 1)).setMilliseconds(-1);
    let arr = {
      nian,
      start: t1,
      end: t2
    }
    // console.log(arr)
    return arr
  },
  zhuan: function (time) {//转换时间戳
    let date = new Date(time);
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
  },
  //时间戳转换成日期时间
  js_date_time: function (unixtime) {
    var date = new Date(unixtime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    return h + ':' + minute;

  },
  getTimer: function (stringTime) {//刚刚时间戳处理
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let month = day * 30;
    let time1 = new Date().getTime();//当前的时间戳
    let time2 = Date.parse(new Date(stringTime));//指定时间的时间戳
    // console.log(time1);
    // console.log(time2);
    let time = time1 - time2;
    let result = null;
    // if(time < 0){
    //     alert("设置的时间不能早于当前时间");
    // }else if(time/month >= 1){
    //     result =  parseInt(time/month) + "月前";
    // }else if(time/week >= 1){
    //     result =  parseInt(time/week) + "周前";
    // }else if(time/day >= 1){
    //     result =  parseInt(time/day) + "天前";
    // }else if(time/hour >= 1){
    //     result =  parseInt(time/hour) + "小时前";
    // }else if(time/minute >= 1){
    //     result =  parseInt(time/minute) + "分钟前";
    // }else {
    //     result = "刚刚";
    // }
    var date = new Date(stringTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    if (time / day >= 1) {
      result = y + '.' + m + '.' + d;
      // result =  parseInt(time/day) + "天前";
    } else if (time / hour >= 1) {
      result = parseInt(time / hour) + "小时前";
    } else if (time / minute >= 1) {
      result = parseInt(time / minute) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result
  },
  Day: function (date) {//前后当日时间  
    // console.log(date)
    let systemDate = new Date(date);
    let year = systemDate.getFullYear();
    let month = systemDate.getMonth() + 1;
    let day = systemDate.getDate();
    if (day < 10) { // 如果日小于10，前面拼接0  
      day = '0' + day;
    }
    if (month < 10) { // 如果月小于10，前面拼接0 
      month = '0' + month;
    }
    let xie = [year, month, day].join('/');
    let heng = [year, month, day].join('-')
    let arr = {
      xie, heng
    }
    // console.log(arr)
    return arr;
  },
  weeks: function (data) {//前后本周时间
    // console.log(data)
    var date = new Date(data);
    var today = date.getDay();
    var stepSunDay = -today + 1;
    if (today == 0) {
      stepSunDay = -7;
    }
    var stepMonday = 7 - today;
    var time = date.getTime();
    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
    var startDateYear = this.transferDate(monday).dateString2;
    var endDateYear = this.transferDate(sunday).dateString2;
    var startDate = this.noYear(monday);
    var endDate = this.noYear(sunday);
    let start = new Date(startDateYear).getTime()
    let end = new Date(endDateYear).getTime()
    let zhouTime = startDate + ' - ' + endDate;
    let zhouTimes = startDateYear + ' 至 ' + endDateYear
    let arr = {
      start, end, zhouTime, startDateYear, endDateYear,zhouTimes
    }
    return arr;
  },
  month: function (time) {//前后本月时间
    // 获取当前月的第一天  
    var start = new Date(time);
    let year = start.getFullYear()
    let yue = start.getMonth() + 1;
    start.setDate(1);
    // 获取当前月的最后一天  
    var date = new Date(time);
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var end = new Date(nextMonthFirstDay - oneDay);
    var startDate = this.transferDate(start).dateString2; // 日期变换  
    var endDate = this.transferDate(end).dateString2; // 日期变换  
    let tstart = new Date(start).getTime()
    let tend = new Date(end).getTime()
    let arr = {
      start: tstart,
      end: tend,year,
      yue, startDate, endDate
    }
    return arr;
  },
  year: function (time) {//前后今年时间
    const d = new Date(time);
    let nian = d.getFullYear()
    const d1 = new Date(d.setFullYear(d.getFullYear()));
    let t = new Date(new Date(d1.setDate(1)).setHours(0, 0, 0, 0));
    let t1, t2 = 0;
    t1 = t.setMonth(0);
    const d2 = new Date(t1);
    t2 = new Date(d2.setFullYear(d2.getFullYear() + 1)).setMilliseconds(-1);
    let arr = {
      nian,
      start: t1,
      end: t2
    }
    // console.log(arr)
    return arr
  },
  onLaunch: function () {
    if (wx.getStorageSync('token') && wx.getStorageSync('token') != '') {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.reLaunch({
        url: '/pages/logs/logs',
      })
    }
  },
  // 设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  }
})