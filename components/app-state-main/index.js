// commpents/app-main/app-main.js
const app = getApp()
const fw = require('../../lib/framework.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTabPage: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: app.globalData.barHeight * 2 + 20,
    state: {
      load: "LOAD",
      error: "ERROR",
      empty: "EMPTY",
      main: "MAIN"
    },
    current: 'MAIN',
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stateError() {
      this.setData({
        current: this.data.state.error
      })
      // wx.hideLoading();
    },
    stateEmpty() {
      this.setData({
        current: this.data.state.empty
      })
      // wx.hideLoading();
    },
    stateLoading() {
      // wx.showLoading({
      //   title: '加载中',
      // })
      // this.setData({
      //   current: this.data.state.load
      // })
    },
    stateMain() {
      this.setData({
        current: this.data.state.main
      })
      // wx.hideLoading();
    },
    refresh() {
      // this.triggerEvent('refresh',{})
      // 页面重载
      if (getCurrentPages().length != 0) {
        //刷新当前页面的数据
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      }
    },
    watchBack: function (that, name) {
      if (that.data.show) {
        switch (name) {
          case "ERROR":
            that.stateError();
            break
          case "MAIN":
            that.stateMain();
            break
        }
      }
    }
  },
  lifetimes: {
    attached: function () {
      let that = this;
      app.watch(that, that.watchBack)
    }
  },
  pageLifetimes: {
    show() {
      // 页面被展示
      this.setData({
        show: true
      })
    },
    hide() {
      // 页面被隐藏
      this.setData({
        show: false
      })
    },
    resize(size) {
      // 页面尺寸变化
    }
  }
})
