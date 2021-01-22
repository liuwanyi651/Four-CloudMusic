// components/newsong/newsong.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newsong: {
      type: Array
    },
    // newsongs: {
    //   type: Array
    // },
    album: {
      type: Array
    },
    // albums: {
    //   type: Array
    // },
    djprogram: {
      type: Array
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    num: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goOne() {
      this.setData({
        num: 0
      })
    },
    goTwo() {
      this.setData({
          num: 1
        }
      )
    },
    goThree() {
      this.setData({
          num: 2
        }
      )
    },

  }
})