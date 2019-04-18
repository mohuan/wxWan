Component({
  pageLifetimes: {
    show() {
      // 自定义tabbar 的时候需要放开
      // if (typeof this.getTabBar === 'function' &&
      //   this.getTabBar()) {
      //   this.getTabBar().setData({
      //     selected: 1
      //   })
      // }
    }
  }
})