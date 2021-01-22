const {
  default: api
} = require("../../http/api")

// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '', //热搜前十条数据
    dataa: '', //热搜后十条数据
    show: false,
    content: '',
    value: '',
    flag: 0,
    arras: [],
    allMatch: [], //含有关键字的搜索信息
  },
  // 展开更多热搜
  show() {
    this.setData({
      show: true
    })
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
  //搜索详情
  details(e){
    //  console.log(e)
     let name = e.currentTarget.dataset.item.searchWord
    //  console.log(name)
    wx.navigateTo({
      url: `../../pages/details/details?name=${(name)}`,
    })
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
  // 回车事件 存值
  Search(e) {
    this.data.arras.unshift(this.data.content)
    this.setData({
      arras: Array.from(new Set(this.data.arras))
    })
    wx.setStorage({
      data: Array.from(new Set(this.data.arras)),
      key: 'value',
    })
    if (this.data.content !== '') { //判断输入框输入内容不为空时 
      api.search(this.data.content).then((res) => {
        // console.log(res); //拿到含有关键字的歌手 歌曲等
        this.setData({
          allMatch: res.result.allMatch,
          flag:1,
        })
        // console.log(this.data.allMatch);
      })
    } else {
      this.setData({
        flag: 0
      })
    }
  },
  // 清空 让数组为空
  clearHistory() {
    let that = this
    wx.showModal({
      content: '确定清空全部历史记录？',
      success(res) {
        if (res.confirm) {
          that.setData({
            arras: []
          })
          wx.clearStorage()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  back(){
    wx.switchTab({
      url: '/pages/find/find',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arras = wx.getStorageSync('value')
    // console.log(arras);
    if (arras.length > 0) {
      this.setData({
        arras: arras
      })
    }
    // 热搜榜接口
    api.hot().then((res) => {
      // console.log(res);
      this.setData({
        data: res.data.slice(0, 10)
      })
      // console.log(this.data.data);
      this.setData({
        dataa: res.data.slice(10, 20)
      })
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