// components/app-main.js
const app = getApp();
const fw = require('../../lib/framework.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTabPage: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: app.globalData.barHeight * 2 + 20,
    isHeight: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
