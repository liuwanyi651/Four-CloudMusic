// pages/play/play.js
import dayjs from 'dayjs'
import api from "../../http/api"
let bg = wx.getBackgroundAudioManager() //全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cycle: 0, //控制(列表循环0)(单曲循环1)(随机2)
    stop: false, //暂停开始判断条件
    show: true, //定时器判断
    showTotalTime: "00:00", //总时长
    value: 0, //滑块绑定的值
    nowtime: '00:00', //当前播放的时长
    maxtiem: 0, //最大时长
    id:'', //发请求用的id
    isScroll: false, //是否显示滚动水平线
    songname: '', //歌名
    singer: [], //演唱者
    lyric: [], //歌词
    lyrictime: [], //歌词时间
    lyrictimeshow: '00:00', //横线指示的时间
    location: 0,
    locationValue: 0, //歌词滚动具体位置
    locationTime: 0, //歌词定位时间
    showlyric: false, //是否展示歌词
    url: '', //用来装发送拿到url的请求
    img: '', //用来装发送拿到图片的请求
    index: 0, //用来接受拿到传入index的值
    idplay: [], //用来接收传入的id数组
    up: [
      '../../images/like.png',
      '../../images/download.png',
      '../../images/vip.png',
      '../../images/comment.png',
      '../../images/three.png'
    ],
    down: [
      '../../images/cycle.png',
      '../../images/on.png',
      '../../images/play.png',
      '../../images/next.png',
      '../../images/playlist.png'
    ]

  },
  //获取url
  getUrl() {
    if (this.data.id) {

      api.musicUrl(
        this.data.id
      ).then(res => {

        if (res.data[0].url) {
          this.data.url = res.data[0].url
          this.setData({
            url: this.data.url
          })
          bg.src = this.data.url
          bg.title = "123"
        } else {

        }

      }).catch(err => {
        console.log(err)
      })
    } else {}
  },
  //获取图片
  getImg() {
    console.log(this.data.id)
    api.songdetail(
      this.data.id
    ).then(res => {

      this.data.songname = res.songs[0].al.name
      this.data.singer = res.songs[0].ar
      this.data.img = res.songs[0].al.picUrl
      this.setData({
        img: this.data.img,
        songname: this.data.songname,
        singer: this.data.singer
      })
    }).catch(res => {
      console.log(res)
    })
  },
  //获取歌词
  getLyric() {
    api.lyric(
      this.data.id
    ).then(res => {
       console.log(res)
      let a = res.lrc.lyric.split('\n')
      let ci = [],
        citime = []
      a.map(item => {
        // 时间
        let time = item.match(new RegExp("\\[[0-9]*:[0-9]*.[0-9]*\\]", "g"))
        if (time) {
          time = time[0].replace("[", '').replace("]", '')
          let it = Number(time.split(':')[0] * 60) + Number(time.split(':')[1].split('.')[0]);
          //毫秒：+Number(time.split(':')[1].split('.')[1]);
          // console.log(time,dayjs(time).format('mm:ss'));
          citime.push(it)
          ci.push(item.replace(new RegExp("\\[[0-9]*:[0-9]*.[0-9]*\\]", "g"), ''))
        }
      })
      //去空
      let a1 = [],
        a2 = [];
      for (let i = 0; i < ci.length; i++) {
        if (citime[i] && ci[i]) { //当前是否有歌词
          a1.push(citime[i]);
          a2.push(ci[i]);
        }
      }
      this.data.lyrictime = a1
      this.data.lyric = a2
      this.setData({
        lyrictime: this.data.lyrictime,
        lyric: this.data.lyric
      })
      // console.log(this.data.lyrictime, "lyrictime")
      // console.log(this.data.lyric, 'lyric')
      wx.hideLoading()
    }).catch(ree => {
      console.log(ree)
    })
  },
  //定时器
  playmusic() {
    setInterval(() => {
      if (this.data.show === true) {
        this.data.showTotalTime = dayjs(bg.duration * 1000).format('mm:ss')
        this.data.nowtime = dayjs(bg.currentTime * 1000).format('mm:ss')
        this.data.maxtiem = parseInt(bg.duration) //解析一个字符传并返回一个整数
        this.data.value = parseInt(bg.currentTime)
        this.setData({
          value: this.data.value,
          showTotalTime: this.data.showTotalTime,
          nowtime: this.data.nowtime,
          maxtiem: this.data.maxtiem
        })
        if (this.data.showlyric === true) {
          for (let i = 0; i < this.data.lyric.length; i++) {
            // console.log(this.data.value, this.data.lyrictime[this.data.lyric.length - 1])
            if (this.data.value > this.data.lyrictime[this.data.lyric.length - 1]) { //最后的歌词的时间比较
              this.setData({
                location: this.data.lyric.length - 1,
                lyrictimeshow: dayjs(this.data.lyrictime[this.data.lyric.length - 1] * 1000).format('mm:ss')
              });
              break;
            }
            // console.log(this.data.nowtime, this.data.lyric[i]);
            if (this.data.value >= this.data.lyrictime[i] && this.data.value < this.data.lyrictime[i + 1]) {
              // console.log("歌词滚动");
              this.setData({
                location: i,
                lyrictimeshow: dayjs(this.data.lyrictime[i] * 1000).format('mm:ss')
              });
              break;
            }
          }
        }
        // console.log(this.data.showTotalTime, "总时长mm-ss")
        // console.log(this.data.nowtime, "当前播放的时长mm-ss")
        // console.log(this.data.maxtiem, "最大时长s")
        // console.log(this.data.value, "value s")
      }
    }, 1000)
  },
  //滑动改变后
  change(event) {
    bg.seek(event.detail.value)

    this.data.show = true
    this.setData({
      show: this.data.show
    })
  },

  //滑动中事件
  changeing(event) {
    let a = false
    this.setData({
      show: a,
      nowtime: dayjs(event.detail.value * 1000).format('mm:ss')
    })
  },
  //暂停
  stop() {
    //公共变量的修改
   
    //console.log(app.globalData.flag)

    if (this.data.stop === false) {
      var app = getApp()
     app.globalData.flag =true
      bg.pause()
      this.data.stop = true
      this.setData({
        stop: this.data.stop
      })
    } else {
      var app = getApp()
     app.globalData.flag =false
      bg.play()
      this.data.stop = false
      this.setData({
        stop: this.data.stop
      })
    }
  },
  //是否展示歌词
  showlyric() {
    if (this.data.showlyric === false) {
      this.data.showlyric = true
      this.setData({
        showlyric: this.data.showlyric
      })
    } else if (this.data.showlyric === true) {
      this.data.showlyric = false
      this.setData({
        showlyric: this.data.showlyric,
        isScroll: false
      })
    }
    console.log(this.data.showlyric)
  },
  //获取storage数据
  history() {
    let arr = []
    arr = wx.getStorageSync('songlist')
    this.setData({
      idplay: arr
    })
    
  },
  //上一首
  above() {
    if (this.data.index == 0) {
      this.data.index = 33
      console.log(this.data.index)
      this.setData({
        id: this.data.idplay[this.data.index].id
      })
      this.getImg()
      this.getUrl()
      this.playmusic()
      this.getLyric()
      this.history()
    } else {
      console.log(this.data.index)
      this.setData({
        index: this.data.index - 1
      })
      this.setData({
        id: this.data.idplay[this.data.index].id
      })
      this.getImg()
      this.getUrl()
      this.playmusic()
      this.getLyric()
      this.history()
    }


  },
  //下一首
  following() {
    if (this.data.index === this.data.idplay.length - 1) {
      this.setData({
        id: this.data.idplay[this.data.index].id,
        index: 0
      })
      this.getImg()
      this.getUrl()
      this.playmusic()
      this.getLyric()
      this.history()
    } else {
      this.setData({
        index: this.data.index + 1
      })
      this.setData({
        id: this.data.idplay[this.data.index].id
      })
      this.getImg()
      this.getUrl()
      this.playmusic()
      this.getLyric()
      this.history()
    }
  },
  //控制播放顺序 列表循环/单曲循环/随机播放
  cycles() {
    this.setData({
      cycle: 1
    })
  },
  Singcycle() {
    this.setData({
      cycle: 2
    })
  },
  random() {
    this.setData({
      cycle: 0
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中',
    })
    let id = options.id
    console.log(options)
    let index = options.index
    this.setData({
      id: id,
      index: parseInt(index),
    })

    this.getImg()
    this.getUrl()
    this.playmusic()
    this.getLyric()
    this.history()

    bg.onEnded(() => { //自然播放结束
      if (this.data.cycle === 0) {
        console.log(this.data.idplay.length-1)
        if(this.data.index===this.data.idplay.length-1){
          this.setData({
            index:0
          })
          this.following()

        }else{
          this.following()
        }
        
      } else if (this.data.cycle === 1) {
          this.setData({
            index: this.data.index
          })
          this.setData({
            id: this.data.idplay[this.data.index].id
          })
          this.getImg()
          this.getUrl()
          this.playmusic()
          this.getLyric()
          this.history()
        
      }else if(this.data.cycle === 2){
        let num = Math.floor(Math.random()*this.data.idplay.length)
        this.setData({
          index: num
        })
        this.setData({
          id: this.data.idplay[this.data.index].id
        })
        this.getImg()
        this.getUrl()
        this.playmusic()
        this.getLyric()
        this.history()
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