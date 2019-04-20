const app = getApp();
const config = require('../config/config.js');
const apiUrl = require('../config/api/index.js');
const Util = require('./util.js');

const alertSuccess = function(content) {
  wx.showToast({
    title: content ? content : '操作成功',
    icon: 'none',
    duration: 2000
  })
}

const alertError = function(content) {
  wx.showToast({
    title: content ? content : '操作成功',
    icon: 'none',
    duration: 2000
  })
}

const alertConfirm = function(o) {
  wx.showModal({
    title: o.title ? o.title : '确认操作',
    content: o.content ? o.content : '确认进行操作吗？',
    success(res) {
      if (res.confirm) {
        if (o.doOk) {
          o.doOk();
        }
      } else if (res.cancel) {
        if (o.doCancel) {
          o.doCancel();
        }
      }
    }
  })
}

const countHeight = function(h) {
  var calc = 0
  wx.getSystemInfo({
    success: (res) => {
      var clientHeight = res.windowHeight,
        clientWidth = res.windowWidth,
        rpxR = 750 / clientWidth;
      calc = clientHeight * rpxR - (app.globalData.barHeight * 2 + 20) / clientWidth * 750 - h;
      //app.globalData.barHeight * 2 + 20 topbar 的高度
    }
  })
  return calc;
}

const getMethod = function(api) {
  let apiArr = apiUrl[api].split(' ');
  let method = 'GET';
  if (apiArr.length > 1) {
    method = apiArr[0];
  }
  return method;
}

const api = function(ops) {
  let that = this
  return new Promise((resolve, reject) => {
    ops.header = ops.header ? ops.header : {};
    ops.header['Content-Type'] = 'application/json'
    // ops.header.ticket = app.globalData.ticket;
    // ops.header.sid = app.globalData.sid;
    ops.params = ops.params ? ops.params : {};
    if (!ops.disableMask)
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
      method: ops.method ? ops.method.toUpperCase() : 'GET',
      url: config.base_url + ops.url,
      data: ops.data ? ops.data : {},
      header: ops.header,
      success(res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          if (ops.successMessage === '') {} else {
            that.alertSuccess(ops.successMessage ? ops.successMessage : '操作成功！');
          }
          //根据具体的程序进行调整
          if (res.data.errorCode == 0){
            resolve(res.data.data);
          }else{
            reject(res.data.errorMsg);
          }
          // resolve(res.data)
        } else {
          if (res.statusCode == 404) {
            that.alertError('网络中断，请稍后重试');
            // ops.method == "GET" ? app.states.statePage = "ERROR" : null;
            reject()
          } else if (res.statusCode == 500) {
            that.alertError('网络繁忙，请稍后重试');
            // ops.method == "GET" ? app.states.statePage = "ERROR" : null;
            reject()
          } else if (res.statusCode == 503) {
            that.alertError('服务器异常，请稍后重试');
            // ops.method == "GET" ? app.states.statePage = "ERROR" : null;
            reject()
          } else if (res.statusCode == 401) {
            wx.reLaunch({
              url: config.defaultRoute
            })
          } else {
            reject(res)
          }
        }
      },
      fail() {
        wx.hideLoading()
        that.alertError('网络中断，请稍后重试');
        // ops.method == "GET" ? app.states.statePage = "ERROR" : null;
        reject()
      },
      complete() {

      }
    })
  })
}

const rest = function(api, data = {}, ops) {
  let that = this
  return new Promise((resolve, reject) => {
    let apiArr = apiUrl[api].split(' ');
    let url = '';
    let method = 'GET';
    if (apiArr.length > 1) {
      url = apiArr[1];
      method = apiArr[0];
    } else {
      url = apiUrl[api];
    }
    let iops = ops ? ops : {
      successMessage: ''
    };
    iops.data = data ? data : {};
    iops.url = url;
    iops.method = ops && ops.method ? ops.method : method;
    that.api(iops).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}

const restList = function (api, data = {}, ops) {
  let that = this
  return new Promise((resolve, reject) => {
    let replaceWith = data["page"];
    let apiArr = apiUrl[api].split(' ');
    let url = '';
    let method = 'GET';
    if (apiArr.length > 1) {
      url = apiArr[1].replace(new RegExp("{{page}}", 'g'), replaceWith);;
      method = apiArr[0];
    } else {
      url = apiUrl[api].replace(new RegExp("{{page}}", 'g'), replaceWith);;
    }
    let iops = ops ? ops : {
      successMessage: ''
    };
    iops.data = data ? data : {};
    iops.url = url;
    iops.method = ops && ops.method ? ops.method : method;
    that.api(iops).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error)
    })
  })
}



const rpx2px = function(rpx) {
  return rpx / 750 * wx.getSystemInfoSync().windowWidth
}

const px2rpx = function(px) {
  return px * 750 / wx.getSystemInfoSync().windowWidth
}

const page = function(orgPage) {
  let _onLoad = orgPage.onLoad
  orgPage.onLoad = function(options) {
    let that = this
    // app.states.statePage = 'MAIN';
    let currentRouter = getCurrentPages();
    let route = currentRouter.pop().route
    let pass = true;
    // if (config.access.black && config.access.black.length > 0) {
    //   config.access.black.forEach(it => {
    //     let reg = new RegExp(it)
    //     if (reg.test(route) && (app.globalData.ticket == null || app.globalData.ticket == '')) {
    //       pass = false;
    //     }
    //   })
    // }
    // if (config.access.white && config.access.white.length > 0) {
    //   config.access.white.forEach(it => {
    //     let reg = new RegExp(it)
    //     if (reg.test(route)) {
    //       pass = true;
    //     }
    //   })
    // }
    if (pass) {
      _onLoad.call(that, options)
    } else {
      //这里需要判断是否 传参数给 登录页面，以便跳转到 绑定学生页面
      // bind=1&classId=1213123
      // if (options.hasOwnProperty('bind') && options.hasOwnProperty('classId') && options.bind == 1) {
      //   wx.reLaunch({
      //     url: config.defaultRoute + "?bind=1&classId=" + options.classId
      //   })
      // } else {
      //   wx.reLaunch({
      //     url: config.defaultRoute
      //   })
      // }

      wx.reLaunch({
        url: config.defaultRoute
      })

    }
  }
  let _onShow = orgPage.onShow;
  orgPage.onShow = function() {
    let that = this;
    // app.states.statePage = 'MAIN';
    _onShow.call(that)
  }
  let _onShareAppMessage = orgPage.onShareAppMessage;
  orgPage.onShareAppMessage = function() {
    let that = this;
    let rt = _onShareAppMessage.call(that)
    if (rt) {
      return rt
    } else {
      //默认分享设置
      return {
        title: '玩呗',
        path: 'pages/index/index',
        imageUrl: 'https://skyworth-cloud-image.oss-cn-beijing.aliyuncs.com/wxapp/share/mini-logo.jpg'
      }
    }
  }
  return Page(orgPage)
}

module.exports = {
  config: config,
  util: Util,
  alertSuccess: alertSuccess,
  alertError: alertError,
  alertConfirm: alertConfirm,
  countHeight: countHeight,
  rpx2px: rpx2px,
  px2rpx: px2rpx,
  getMethod: getMethod,
  api: api,
  rest: rest,
  restList: restList,
  Page: page,
}