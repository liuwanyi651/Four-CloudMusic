import api from "../../http/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航便签数据
    navId: '', //导航的标识
    cookie: '',
    videoList: [], //视频列表数据
    mv: '',
    vid: '',
    arrs: [],
    videoContext: '',
  },
  play(e) { //播放
    // console.log(e.currentTarget.dataset.index)
    this.data.videoList.map((item, index) => {
      // console.log('myVideo' + index);
      let videoContext = wx.createVideoContext('myVideo' + index, this)
      if (index === e.currentTarget.dataset.index) {
        videoContext.play()
      } else {
        videoContext.pause()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cookie = wx.getStorageSync('cookie') //登录并携带cookie 才能拿到下面视频列表数据的请求
    if (cookie) {
      this.setData({
        cookie: cookie
      })
      // console.log(this.data.cookie);
    }
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 跳至登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.videoGrouplist() //调用
  },
  // 获取导航数据
  videoGrouplist() {
    api.videoGroupList().then((res) => {
      this.setData({
        videoGroupList: res.data.slice(0, 14),
        navId: res.data[0].id //默认是第一个（现场）
      })
      // console.log(this.data.videoGroupList);
      this.videoGroup(this.data.navId)
    })
  },
  // 获取视频列表数据
  videoGroup() {
    api.videoGroup(this.data.navId, this.data.cookie).then((res) => {
      // let index = 0;
      let videoList = res.datas.map((item) => { //为每一项添加id
        // item.id = index++
        return item
      })
      this.setData({
        videoList
      })
      // console.log(this.data.videoList);
      let song = res.datas
      let arr = []
      song.map((item) => {
        if (item.data.vid !== undefined) {
          arr.push(item.data.vid)
        }
      })
      // console.log(arr);
      for (let i = 0; i <arr.length; i++) {
        api.mvvideo(arr[i]).then((res) => {
          let name=res.urls[0].url
          this.setData({
            videoList:this.data.videoList
          })
            this.data.videoList[i].url=name
            // console.log(this.data.videoList[i],i)
        })
      }
    })
  },
  //点击切换导航的回调
  changeNav(e) {
    //  console.log(e);
    let navId = e.currentTarget.id //通过id向event传参的时候如果传的是number会自动转换成string 用data-id传过来就不会有这个转换问题
    // console.log(typeof navId);
    this.setData({
      navId: navId * 1 //再转换成number类型
    })
    //  动态获取当前导航对应的视频数据
    this.videoGroup(this.data.navId)

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