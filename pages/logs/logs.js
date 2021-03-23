//logs.js
const app=getApp();
Page({
  data: {
    phone:"",
    code:"",
    codeVal:'获取验证码',
    isCode:false,
    // data:""
  },
  
  getCode:function(){//获取验证码
    app.request('POST', '/send_msg/', {
      phone:this.data.phone
    }, res => {
      if (res.data.code == 200) {
        let num = 60;
        this.setData({
          codeVal:num+'s',
          isCode:true,
          code:res.data.data
        })
        let time = setInterval(()=>{
          num--;
          this.setData({
            codeVal:num+'s'
          })
          if(num <= 0){
            clearInterval(time)
            this.setData({
              codeVal:'获取验证码',
              isCode:false
            })
          }
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        this.setData({
          isCode:false
        })
      }
    })
  },
  login:function(){//登录
    let that=this;
    if(this.data.phone == ''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }else if(this.data.code == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    app.request('POST', '/on_phone/', {
      phone:this.data.phone,
      code:this.data.code
    }, res => {
      if (res.data.code == 200) {
        wx.setStorageSync('token', res.data.data.token);
          let res1=JSON.stringify(res.data.data);
          wx.showToast({
            title: "登录成功", 
            icon: "success", 
            duration: 2000, 
            mask: false
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: `../information/information?data=${res1}`,
              // url: `../scanning/scanning`,
              // url: `../zhoupressure/zhoupressure`,
            })
          },2000)
         
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
  },
  onLoad: function () {
    
  }
})
