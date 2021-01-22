const {
  default: api
} = require("../../http/api");

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: '',
    userPassword: '',
    checkPawd: false,
  },
  // 跳转注册页
  goenroll() {
    wx.navigateTo({
      url: '/pages/enroll/enroll',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //表单项内容发生改变的回调
  handleInput(e) {
    let type = e.currentTarget.dataset.type
    // console.log(e);
    this.setData({
      [type]: e.detail.value
    })
  },
  // 去登陆
  login() {
   console.log(123)
    //1.手机表单项数据
    let {
      userPhone,
      userPassword
    } = this.data
    //2.前端验证
    /*
    手机号验证：
    1.内容为空
    2.手机号格式不正确
    3.手机号格式正确，验证通过
    */
    if (!userPhone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(userPhone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    // 密码验证
    if (!userPassword) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    // 定义正则表达式
    let passwordReg = /^[0-9a-zA-Z]{0,25}$/g;
    if (!passwordReg.test(userPassword)) {
      wx.showToast({
        title: '密码格式错误',
        icon: 'none'
      })
      return
    }
    api.login(userPhone, userPassword).then((res) => {
      console.log(res);
      if (res.code === 200) {
        wx.showToast({
          title: '登录成功'
        })
        // console.log(res);
        // 将用户信息存储至本地
        wx.setStorageSync('userInfo', JSON.stringify(res.profile)) //存键和值
        wx.setStorageSync('cookie', res.cookie) //存键和值
        wx.reLaunch({
          // url: '/pages/find/find',
          url: '/pages/my/my',
        })
      } else if (res.code === 400) {
        wx.showToast({
          title: '手机号错误',
          icon: 'none'
        })
      } else if (res.code === 502) {
        wx.showToast({
          title: '密码错误',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '登录失败，请重新登录',
          icon: 'none'
        })
      }  
    }).catch(err => {
      // console.log(err)
      if(err.status==501){
        wx.showToast({
          title: '账号不存在',
          icon: 'none'
        })
      }
    })
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