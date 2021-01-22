import PubSub from 'pubsub-js';
import moment from 'moment';

const {
  default: api
} = require("../../http/api");
//获取全局的实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    song: [],
    ids: '',
    id: '',
    musicId: '', //音乐的id
    currentTime: '00:00', //实时时间
    durationTime: '00:00', //总时长
    currentWidth: 0, //实时进度条的宽度
   

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    // options 用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会被自动截取掉 所以这里传的是歌曲的id值
    let musicId = options.musicId
    // console.log(options);
    //console.log(musicId);  拿到歌曲的id值
    this.setData({
      musicId
    })
    this.setData({
      ids: musicId //把拿到歌曲id值赋值给ids 
    })
    // console.log(this.data.ids) 
    this.getMusicInfo() //调下面获取音乐详情的函数

    /*
  问题：如果用户操作系统的控制播放/暂停按钮，页面不知道，导致页面显示是否显示播放状态和真实音乐播放状态不一致
  解决方案：
  1.通过控制音频的实例backgroundAudioManager去监视音乐的播放暂停
  */
    // 判断之前的音乐是否是在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前页面音乐状态为true
      this.setData({
        isPlay: true
      })
    }
    this.backgroundAudioManager = wx.getBackgroundAudioManager() //背景音乐属性
    //  监视音乐的播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      // console.log('play()');
      this.changePlayState(true)
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      // console.log('pause()');
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      // console.log('stop()');
      this.changePlayState(false)
    })
      //监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      //自动切换至下一首音乐，并且自动播放
      PubSub.publish('switchType', 'next')
      //将实时进度条的长度还原成0,时间还原成0
      this.setData({
        currentWidth:0,
        currentTime: '00:00', //实时时间
      })
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      console.log('总时长：', this.backgroundAudioManager.duration);
      console.log('实时的时长：', this.backgroundAudioManager.currentTime);
      //格式化实时的播放时间
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss");
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  //修改播放状态的功能函数
  changePlayState(isPlay) {
    //修改音乐是否的状态
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 获取音乐详情的功能函数
  getMusicInfo() {
    api.songdetail(this.data.ids).then((res) => {
      // console.log(res);
      //res.songs[0].dt 单位ms
      let durationTime = moment(res.songs[0].dt).format("mm:ss");
      this.setData({
        song: res.songs[0],
        durationTime
      })
      // console.log(this.data.song);
    })
  },
  // 点击播放或者暂停的回调
  handlemusicPlay() {
    let isPlay = !this.data.isPlay
    // // 修改是否播放的状态
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay)
  },

  // 控制音乐播放/暂停的功能函数
  musicControl(isPlay) {
    if (isPlay) { //音乐播放
      //创建控制音乐播放实例
      let {
        musicId
      } = this.data //拿到音乐id
      api.musicUrl(this.data.musicId).then((res) => {
        console.log(res);
        let musicLink = res.data[0].url
        console.log(musicLink);
        this.backgroundAudioManager.src = musicLink //当设置了新的 src 时，会自动开始播放
        this.backgroundAudioManager.title = this.data.song.name //title音频标题，(必填）
      })
    } else { //暂停音乐
      this.backgroundAudioManager.pause()
    }
  },
  // 点击切歌的回调
  handleSwitch(e) {
    // 获取切歌的类型
    let type = e.currentTarget.id;
    // console.log(type);
    // 关闭当前音乐
    this.backgroundAudioManager.stop()
    //订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      //获取音乐详情 更新musicId 拿到上一首/下一首
      api.songdetail(musicId).then((res) => {
        this.setData({
          song: res.songs[0]
        })
      })
      // 自动播放当前的音乐
      this.musicControl(true, musicId)
      api.musicUrl(musicId).then((res) => {
        // console.log(res)
        let musicLink = res.data[0].url
        console.log(musicLink);
        this.backgroundAudioManager.src = musicLink //当设置了新的 src 时，会自动开始播放
        this.backgroundAudioManager.title = this.data.song.name //title音频标题，(必填）
      })
      //取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据recommendSong页面
    PubSub.publish('switchType', type)
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