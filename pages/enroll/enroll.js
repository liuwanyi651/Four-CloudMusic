const {
  default: api
} = require("../../http/api")

// pages/enroll/enroll.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: '',
    userPassword: '',
    password: null,
    checkPawd: false,
    show: false,
    code: null,
    countDownNum: '60', //从60开始倒计时
    banner: '',
    timer: '',//定时器名字
    captcha: null,
    nickname:''

  },
  // 去登陆
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //用户名
  username(e) {
    this.setData({
      nickname:e.detail.value
    })
    let nickname = e.detail.value;
    if (nickname.length === 0) {
      wx.showToast({
        title: '用户名不能为空', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    }
  },
  // 手机号的验证
  userPhoneInput(e) {
    // console.log(e)
    let userPhone = e.detail.value
    let myphone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (userPhone.length === 0) {
      wx.showToast({
        title: '手机号不能为空', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    } else if (userPhone.length > 11) {
      wx.showToast({
        title: '手机长度已超过11位数', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    } else if (!myphone.test(userPhone)) {
      wx.showToast({
        title: '手机号错误', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    } else {
      wx.showToast({
        title: '手机号正确', // 标题
        icon: 'success', // 图标类型  
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
    }
    this.setData({
      userPhone: e.detail.value
    })
    console.log(this.data.userPhone); //拿到输入手机号的值 
  },
  // 密码验证
  userPasswordInput(e) {
    let mypassword = /^[0-9a-zA-Z]{0,25}$/g;
    let userPassword = e.detail.value
    if (userPassword.length === 0) {
      wx.showToast({
        title: '密码还未填写', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    } else if (userPassword.length < 6) {
      wx.showToast({
        title: '密码长度不能低于6位', // 标题
        icon: 'none', // 图标类型
        duration: 1500 // 提示窗停留时间，默认1500ms
      })
      return false
    } else if (mypassword.test(userPassword)) {
      wx.showModal({
        title: '提示',
        content: '请确定输入密码是否正确',
        cancelColor: 'cancelColor',
      })
      this.setData({
        checkPawd: true,
        userPassword: e.detail.value
      })
      console.log(this.data.userPassword); //拿到输入密码的值 
    } else {
      wx.showModal({
        title: '提示',
        content: '密码由0~25位由数字和26个英文字母混合而成',
        success: function (res) {
          this.setData({
            checkPawd: false
          })
        }
      })
    }
  },
  // 发请求获取验证码
  getCode() {
    console.log(this.data.userPhone);
    api.Verification(this.data.userPhone).then(res => {
      this.setData({
        banner: res.banners
      })
    })
    this.countDown();
  },
   //做倒计时
   countDown(){
    this.setData({
      show:true
    })
    let that = this;
   
  let countDownNum = that.data.countDownNum;//获取倒计时初始值
  //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
  // console.log(1)
  that.setData({
   
   timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
    //每隔一秒countDownNum就减一，实现同步
    countDownNum--;
    //然后把countDownNum存进data，好让用户知道时间在倒计着
    that.setData({
     countDownNum: countDownNum
    })
    //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
    if (countDownNum == 0) {
     //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
     //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
     
     clearInterval(that.data.timer);
     that.setData({
        show:false,
      countDownNum: 60,
    })
     //关闭定时器之后，可作其他处理codes go here
    }
   }, 1000)
  })
 
},
  // 验证码
  userCode(e) {
    this.setData({
      captcha:e.detail.value
    })
    console.log(this.data.captcha)
  },
  // 验证验证码
  Verification(){
    api.register(this.data.userPhone,this.data.captcha).then(res=>{
      console.log(res)
    })
  },
  //注册检验账户是否存在
  register(){
  api.register(this.data.userPhone).then(res=>{
    console.log(res)
    if(res.exist!==-1){
      wx.showToast({
        title: '账户已存在',
        icon:'none',
      })
   }else{
     this.Verification()
    api.registor(this.data.userPhone,this.data.userPassword,this.data.captcha,this.data.nickname).then(res=>{
      console.log(res)
    }).catch(err=>{console.log(err)})
   }
  }).catch(err=>{console.log(err)})
  wx.switchTab({
    url: '/pages/find/find',
  })
},

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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