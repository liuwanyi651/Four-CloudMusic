// components/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {
      show: false,
      checked: true,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //展示弹出层
    showPopup(){
      this.setData({ show: true });
    },
    // 关闭弹出层
    onClose() {
      this.setData({ show: false });
    },
    onChange({ detail }) {
      // 需要手动对 checked 状态进行更新
      this.setData({ checked: detail });
    },
    // 去登录
    goLogin(){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }
})

