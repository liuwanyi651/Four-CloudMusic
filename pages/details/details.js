import api from "../../http/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    active: 0,
    single:[],
    song:[],
    video:[],
    related:[],
    singer:[],
    album:[],
    dj:[],
    user:[],
    content: '',
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
   console.log(options)
  this.setData({
    name:options.name
  })
  console.log(this.data.name);
  
  
  //搜索
   api.cloudsearch(this.data.name,1018).then(res => {
    // console.log(res.result.user)
     //处理歌单播放次数数据
     res.result.playList.playLists.map(item => {
     if(item.playCount>10000){
       if((item.playCount/1000-parseInt(item.playCount/10000))*10000>1000){
        item.playCount = parseInt(item.playCount/10000)+'.'+parseInt((item.playCount/10000-parseInt(item.playCount/10000))*10)+'万次'
       }else{
        item.playCount=parseInt(item.playCount/10000)+'万次'
       }
     }
    })
    //处理视频时长数据 播放视频次数数据
    res.result.video.videos.map(item => {
      if(item.durationms>60000){
        item.durationms= parseInt(item.durationms/60000)+':'+parseInt((item.durationms/60000-parseInt(item.durationms/60000))*60)
      }else{
        item.durationms= '00:'+ parseInt(item.durationms/60000)
      }
      if(item.playTime>10000){
        if((item.playTime/1000-parseInt(item.playTime/10000))*10000>1000){
         item.playTime = parseInt(item.playTime/10000)+'.'+parseInt((item.playTime/10000-parseInt(item.playTime/10000))*10)+'万次'
        }else{
         item.playTime=parseInt(item.playTime/10000)+'万次'
        }
      }
    })
     this.setData({
      single:res.result.song,
      song:res.result.playList,
      video:res.result.video,
      related:res.result.sim_query,
      singer:res.result.artist,
      album:res.result.album,
      dj:res.result.djRadio,
      user:res.result.user
     })
    //  console.log(this.data.song)
   }).catch(err => {
     console.log(err);
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