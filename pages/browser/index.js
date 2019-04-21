const fw = require('../../lib/framework.js')
fw.Page({
  data: {
    url:''
  },
  onLoad(options) {
    // Do some initialize when page load.
    this.setData({
      url: options.url
    })
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onResize() {
    // Do something when page resize
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
})