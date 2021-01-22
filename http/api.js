const fly = require('./index')

export default {
  //获取轮播图
  geBanner() {
    return fly.get(`/banner`)
  },
  //获取推荐歌单
  personalized(){
    return fly.get(`/personalized`)
  },
  //获取首页新歌
   newsong() {
    return fly.get(`/personalized/newsong`)
  },
  //获取首页新碟
  album(){
    return fly.get(`/top/album?offset=0&limit=6`)
  },
  //获取首页推荐电台
  djprogram(){
    return fly.get(`/personalized/djprogram`)
  },
  //登录
  login(phone,password){
    return fly.get(`/login/cellphone?phone=${phone}&password=${password}`)
  },
  //获取验证码
  Verification(phone){
    return fly.get(`captcha/sent?phone=${phone}`)
  },
  //注册验证账户是否存在
  register(phone){
    return fly.get(`/cellphone/existence/check?phone=${phone}`)
  },
  // 热搜详细
  hot(){
    return fly.get(`/search/hot/detail`)
  },
  //搜索建议 
  search(keywords,type){
    return fly.get(`/search/suggest?keywords=${keywords}&type=mobile`)
  },
  //获取歌词
  lyric(id){
    return fly.get(`/lyric?id=${id}`)
  },
  //获取每日推荐 需要登录
  recommendSong(cookie){
    return fly.get(`/recommend/songs?cookie=${cookie}`)
  },
  //音乐详情
  songdetail(ids){
    return fly.get(`/song/detail?ids=${ids}`)
  },
  //搜索
  cloudsearch(keywords,type){
    return fly.get(`/search?keywords=${keywords}&type=${type}`)
  },
  //获取音乐url
  musicUrl(id){
    return fly.get(`/song/url?id=${id}`)
  },
  //获取视频标签列表
  videoGroupList(){
    return fly.get(`/video/group/list`)
  },
  //获取视频标签/分类下的视频
  videoGroup(navId,cookie){
    return fly.get(`/video/group?id=${navId}&cookie=${cookie}`)
  },
  //视频详情
  mvdetail(id){
    return fly.get(`/mv/url?id=${id}`)
  },
  //获取视频播放地址
  mvvideo(id){
    return fly.get(`/video/url?id=${id}`)
  },
  //获取用户播放记录
  getUserRecord(userId){
    return fly.get(`/user/record?uid=${userId}&type:0`)
  },
}