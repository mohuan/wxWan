// custom-tab-bar/index.js
const app = getApp()

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
    selected: app.globalData.tabSelected,
    list: [
      {
      "pagePath": "/pages/index/index",
      "iconPath": "/assets/index.png",
      "selectedIconPath": "/assets/active_index.png",
      "text": "首页"
    },
      {
        "pagePath": "/pages/logs/logs",
        "iconPath": "/assets/my.png",
        "selectedIconPath": "/assets/active_my.png",
        "text": "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      app.globalData.tabSelected = data.index
      this.setData({
        selected: data.index
      })
      wx.switchTab({
        url
      })
    }
  },
  lifetimes: {
    attached() {
      //在组件实例进入页面节点树时执行
      this.setData({
        selected: app.globalData.tabSelected ? app.globalData.tabSelected:0
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  pageLifetimes: {
    show() {
      debugger
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  }
})