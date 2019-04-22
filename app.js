//app.js
App({
  onLaunch: function () {
    //获取客户端唯一标识
    // this.globalData.sid = wx.getStorageSync('sid')
    // if (this.globalData.sid == null || this.globalData.sid == "") {
    //   let sid = util.uuid()
    //   wx.setStorageSync('sid', sid)
    //   this.globalData.sid = sid
    // }
    // //获取用户信息
    // this.globalData.ticket = wx.getStorageSync('ticket')
    // this.globalData.userInfo = wx.getStorageSync('userInfo')

    // if (options.scene == 1007 || options.scene == 1008) {
    //   this.globalData.isShare = true
    // } else {
    //   this.globalData.isShare = false
    // };
    // //获取系统导航栏高度
    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.globalData.barHeight = res.statusBarHeight
    //     this.globalData.windowHeight = res.windowHeight
    //     this.globalData.windowWidth = res.windowWidth
    //     this.globalData.screenWidth = res.screenWidth
    //     this.globalData.screenHeight = res.screenHeight

    //   }
    // })
  },
  globalData: {
    userInfo: null
  },
  states: {
    _statePage: 'MAIN'
  },

  watch: function (that, method) {
    var obj = this.states;
    Object.defineProperty(obj, "statePage", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._statePage = value;
        // console.log('是否会被执行2')
        method(that, value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        return this._statePage
      }
    })
  },
})