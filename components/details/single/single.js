import api from "../../../http/api"

// components/details/single.js
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
     //点击事件
  add(e){
    wx.setStorage({
      data:this.data.song,
      key: 'songlist',
    })
    let id=e.currentTarget.dataset.item.id
    this.setData({
      id:id
    })
    
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/play/play?id=${(id)}&index=${(index)}`,
    })
    
  },
    
  },
  pageLifetimes:{
    show(){
      api.cloudsearch(this.data.name,1).then(res => {
        // console.log(res.result.songs)
        this.setData({
          song:res.result.songs
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
})
