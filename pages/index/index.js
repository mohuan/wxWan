//index.js
//获取应用实例
const fw = require('../../lib/framework.js');
Component({
  data: {
    banners: []
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  methods: {
    initData() {
      //1.load head
      this.loadBanner();
    },
    loadBanner() {
      let _self = this;
      fw.rest('banner', {}, {
        disableMask: false,
        successMessage: ''
      }).then(result => {
        // {
        //   "desc": "一起来做个App吧",
        //   "id": 10,
        //   "imagePath": "https://www.wanandroid.com/blogimgs/50c115c2-cf6c-4802-aa7b-a4334de444cd.png",
        //   "isVisible": 1,
        //   "order": 1,
        //   "title": "一起来做个App吧",
        //   "type": 0,
        //   "url": "http://www.wanandroid.com/blog/show/2"
        // }
        _self.setData({
          banners: result
        })
      }).catch(error => {

      })
    }
  },
  pageLifetimes: {
    show() {
      this.initData();
      // 自定义tabbar 的时候需要放开
      // if (typeof this.getTabBar === 'function' &&
      //   this.getTabBar()) {
      //   this.getTabBar().setData({
      //     selected: 0
      //   })
      // }
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  }
})