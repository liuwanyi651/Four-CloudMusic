const {
  default: api
} = require("../../http/api")

// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    result: [],
    newsong: [],
    album: [],
    djprogram: []
  },
  search(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得首页geBanner的接口
    api.geBanner().then((res) => {
      // console.log(res);
      this.setData({
        banners: res.banners
      })
      // console.log(this.data.banners);
    })
    // 获取推荐歌单
    api.personalized().then((res) => {
      // console.log(res);
      res.result.map(item => {
        if (item.playCount >= 100000 && item.playCount < 100000000) {
          item.playCount = parseInt(item.playCount / 10000) + '万'
        } else if (item.playCount >= 100000000) {
          item.playCount = (item.playCount / 100000000).toFixed(1) + '亿'
        } else {
          item.playCount
        }
      })
      this.setData({
        result: res.result.splice(0, 6)
      })
      // console.log(this.data.result);
    })
    //获取首页新歌
    api.newsong().then(res=> {
      this.setData({
        newsong: res.result.slice(0, 6),
      })
      // console.log(this.data.newsong);
    })
    
    //获取首页新碟
    api.album().then((res) => {
      // console.log(res);
      this.setData({
        album: res.albums.splice(0, 6),
      })
      // console.log(this.data.album);
    })
    //获取首页推荐电台
    api.djprogram().then((res) => {
      // console.log(res);
      this.setData({
        djprogram: res.result
      })
      // console.log(this.data.djprogram);
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