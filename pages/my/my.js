const { default: api } = require("../../http/api");

let startY = 0;//手指起始的坐标
let moveY = 0;//手机移动的坐标
let moveDistance = 0;//手指移动的坐标
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}, //用户信息
    coverTransform:'translateY(0)',
    coveTransition:'',
    recentPlayList:[],//用户播放记录
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户基本信息
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      // 更新userInfo的状态
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      console.log(this.data.userInfo);
      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  //获取用户播放记录的功能函数
  getUserRecentPlayList(){
    let{userId}=this.data.userInfo
      api.getUserRecord(userId).then((res)=>{
        console.log(res); 
        let index = 0
        let recentPlayList=res.allData.splice(0,10).map(item=>{
          item.id=index++
          return item
        })
        this.setData({
          recentPlayList
        })  
      })
      
  },
  handleTouchStart(e){
    this.setData({
      coveTransition:''
    })
    // console.log('start');
    startY = e.touches[0].clientY

  },
  handleTouchMove(e){
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    // console.log(moveDistance);
    if(moveDistance<=0){
      return
    }
    if(moveDistance>=80){
      moveDistance = 80
    }
    //动态更新coverTransform的状态值
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
     //动态更新coverTransform的状态值
     this.setData({
      coverTransform:`translateY(0rpx)`,
      coveTransition:'transform 1s linear'
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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