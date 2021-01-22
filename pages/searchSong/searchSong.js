// pages/searchSong/searchSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },
 //拿到搜索的关键字
 content: function (e) {
  this.setData({
    content: e.detail.value
  })
  if (e.detail.value.length === 0) {
    this.setData({
      flag: 0
    })
  }
  // console.log(this.data.content);
},
//点击x 清空内容并返回
cancel(e) {
  if (this.data.content) {
    this.setData({
      content: '',
      flag: 0
    })
  }
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