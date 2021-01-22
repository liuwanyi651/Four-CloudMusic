// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner:{type:Array},
  },

  /**
   * 组件的初始数据
   */
  data: {
    arr:[
      {
        title:'每日推荐',
        img:'../../assets/a1rec.png',
        path:'/pages/classify/classify'
      },
      {
        title:'私人FM',
        img:'../../assets/a2radio.png',
        path:'/pages/classify/classify'
      },
      {
        title:'歌单',
        img:'../../assets/a3songlist.png',
        path:'/pages/classify/classify'
      },
      {
        title:'排行榜',
        img:'../../assets/a4rank.png',
        path:'/pages/classify/classify'
      },
      {
        title:'直播',
        img:'../../assets/a5live.png',
        path:'/pages/classify/classify'
      },{
        title:'数字专辑',
        img:'../../assets/a6album.png',
        path:'/pages/classify/classify'
      },
      {
        title:'唱聊',
        img:'../../assets/a7chat.png',
        path:'/pages/classify/classify'
      },
      {
        title:'游戏专区',
        img:'../../assets/a8piay.png',
        path:'/pages/classify/classify'
      },
    ],
    scroll: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go(e){
      // console.log(e);
      let info = e.currentTarget.dataset.item
      // console.log(info);
      wx.navigateTo({
        url:"/pages/recommendSong/recommendSong",
      })
      
    }
  }
})
