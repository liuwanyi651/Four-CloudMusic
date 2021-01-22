import PubSub, { publish } from 'pubsub-js';
const { default: api } = require("../../http/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'', 
    month:'',
    userInfo:'',
    cookie:'',
    dailySongs:[],//每日推荐歌曲数组
    index:0,//点击音乐的下标

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cookie = wx.getStorageSync('cookie') //登录并携带cookie 才能拿到下面每日推荐的歌曲
    if(cookie){
      this.setData({
        cookie:cookie
      })
      // console.log(this.data.cookie);
   
    }
    // 判断用户是否登录
    let userInfo =wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 跳至登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          }) 
        }
      })
    }
    // 更新日期状态数据
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    // 获取每日推荐的数据
    api.recommendSong(this.data.cookie).then((res)=>{
      // console.log(res);
      this.setData({
        dailySongs:res.data.dailySongs
      })
    }) 
    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType',(msg, type)=>{
      console.log(msg, type);
      let{dailySongs,index}=this.data;
      if(type==='pre'){ //上一首
        (index === 0)&&(index=dailySongs.length)
        index -= 1
      }else{//下一首
        (index===dailySongs.length-1)&&(index=-1)
        index += 1
      }
      //更新下标
      this.setData({
        index
      })
      let musicId = dailySongs[index].id
      // 将musicId回传给songDetail页面
      PubSub.publish('musicId',musicId)
    })
  },
  // 跳转至toSongDetail页面
  toSongDetail(e){
      // console.log(e);
      let {song,index} = e.currentTarget.dataset //解构赋值
      this.setData({
        index
      })
      // console.log(index);
      // 路由跳转传参：query参数
      wx.navigateTo({
        // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
        // url: '/pages/songDetail/songDetail?song='+JSON.stringify(song),
        url: '/pages/songDetail/songDetail?musicId='+song.id,

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