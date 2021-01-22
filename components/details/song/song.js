// components/details/song.js
import api from "../../../http/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    song:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  pageLifetimes:{
    show(){
      api.cloudsearch(this.data.name,1000).then(res => {
        // console.log(res.result.playlists)
        res.result.playlists.map(item => {
          if(item.playCount>10000){
            if((item.playCount/1000-parseInt(item.playCount/10000))*10000>1000){
             item.playCount = parseInt(item.playCount/10000)+'.'+parseInt((item.playCount/10000-parseInt(item.playCount/10000))*10)+'万次'
            }else{
             item.playCount=parseInt(item.playCount/10000)+'万次'
            }
          }
         })
         this.setData({
           song:res.result.playlists
         })
      }).catch(err => {
        console.log(err)
      })
    }
  }
})
