// pages/common/loadding/wellcome.js
// 演示账号
// 18622818663 老师
// 18322229312 家长

const app = getApp()
const fw = require('../../lib/framework.js')

fw.Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginForm: {
      loginName: '',
      passWord: '',
      code: '',
      role: 1,
      lx: '1'
    },
    loading: false,
    clock: 0,
    log: '',
    //登录成功后是否跳转到指定页面
    jump: false,
    //跳转的配置文件
    jumpPages: {
      bind: "pages/parent/bind/index"
    },
    //跳转页面
    jumpPage: '',
    //跳转需要携带的值
    jumpData: '',
    changeRole: true
  },
  roleChange(event) {
    let loginForm = this.data.loginForm;
    loginForm.role = event.currentTarget.dataset.role;
    this.setData({
      loginForm: loginForm
    })
  },
  lxChange(event) {
    let loginForm = this.data.loginForm;
    if (loginForm.lx == '1') {
      loginForm.lx = '0'
    } else {
      loginForm.lx = '1'
    }
    this.setData({
      loginForm: loginForm
    })
  },
  phoneBlur(event) {
    let loginForm = this.data.loginForm;
    loginForm.loginName = event.detail.value
    this.setData({
      loginForm: loginForm
    })
  },
  sendPhoneCode(event) {
    if (this.data.loading) {
      return
    }
    let loginForm = this.data.loginForm;
    console.log(loginForm)

    if (loginForm.loginName == '') {
      fw.alertError('请输入手机号');
      return;
    }
    this.setData({
      loading: true,
      clock: 60
    })
    this.counterClock()

    fw.rest('send-auto-phone-code', {
      phone: loginForm.loginName
    }, {
        successMessage: '发送成功',
        disableConfirm: true
      }).then(result => { }).catch(error => {
        if (error) {
          fw.alertError(error.data.msg)
        }
      })

  },
  sendPhoneCode2(event) {
    if (this.data.loading) {
      return
    }
    let loginForm = this.data.loginForm;
    console.log(loginForm)
    if (loginForm.loginName == '') {
      fw.alertError('请输入手机号');
      return
    }
    this.setData({
      loading: true,
      clock: 60
    })
    this.counterClock()

    fw.rest('send-user-auto-phone-code', {
      phone: loginForm.loginName
    }, {
        successMessage: '发送成功',
        disableConfirm: true
      }).then(result => { }).catch(error => {
        if (error) {
          fw.alertError(error.data.msg)
        }
      })

  },
  counterClock() {
    let that = this
    setTimeout(() => {
      if (that.data.clock <= 0) {
        that.setData({
          loading: false
        })
      } else {
        that.setData({
          clock: that.data.clock - 1
        })
        that.counterClock();
      }
    }, 1000)
  },
  loginFormSubmit(e) {
    let form = e.detail.value
    let url = ''

    if (this.data.loginForm.role == 1) {
      url = this.data.loginForm.lx == '1' ? 'login' : 'login-phone'
    } else {
      url = this.data.loginForm.lx == '1' ? 'user-login' : 'user-login-phone'
    }

    let rules = {}
    let message = {}
    if (this.data.loginForm.lx == '0') {
      rules.phone = {
        required: true,
        tel: true,
        rangelength: [11, 11]
      }
      rules.phoneCode = {
        required: true,
        rangelength: [4, 6]
      }
      message.phone = {
        required: '请输入手机号',
        tel: '请输入11位手机号',
        rangelength: '请输入11位手机号'
      }
      message.phoneCode = {
        required: '请收入验证码',
        rangelength: '验证码长度位4到6位'
      }
    } else {
      rules.loginName = {
        required: true,
        tel: true,
        rangelength: [11, 11]
      }
      rules.passWord = {
        required: true,
        rangelength: [6, 32]
      }
      message.passWord = {
        required: '请收入密码',
        rangelength: '密码长度位6到32位'
      }
      message.loginName = {
        required: '请输入手机号',
        tel: '请输入11位手机号',
        rangelength: '请输入11位手机号'
      }
    }

    let param = {}

    if (this.data.loginForm.role == 1) {
      param = {
        loginName: form.phone,
        passWord: util.slowHash(form.password),
        phone: form.phone,
        phoneCode: form.code
      }
    } else {
      param = {
        loginName: form.phone,
        passWord: util.slowHash(form.password),
        phone: form.phone,
        phoneCode: this.data.loginForm.lx == '1' ? util.slowHash(form.password) : form.code
      }
    }
    let that = this
    fw.doAction(url, param, { disableConfirm: true }, new fw.validate(rules, message)).then(result => {

      app.globalData.userInfo = result
      app.globalData.userInfo.roleType = that.data.loginForm.role + ''
      app.globalData.ticket = result.ticket
      wx.setStorageSync('userInfo', result)
      wx.setStorageSync('ticket', result.ticket)

      if (app.globalData.userInfo.roleType == '2' && app.globalData.userInfo.studentId == undefined) {
        // wx.navigateTo({
        //   url: '/pages/parent/bind/index' + "?classId=123123"
        // })
        //weidingqiang
        if (that.data.jump) {
          wx.navigateTo({
            url: '/pages/parent/bind/index' + "?classId=" + that.data.jumpData
          })
        } else {
          //需要弹框提示
          wx.showToast({
            title: '请通过邀请链接进入小程序',
          })
          //清空数据
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('ticket');
          app.globalData.ticket = null;
          app.globalData.userInfo = null;
        }
      } else {
        wx.switchTab({
          url: '/pages/common/menu/menu1'
        })
      }
    }).catch(error => {
      // 801 是验证码错误，需要提示给用户
      if (error.data && error.data.code === 801) {
        fw.alertError(error.data.msg);
      } else {
        fw.alertError('用户名密码错误')
      }
    })
  },
  roRole: function () {
    let loginForm = this.data.loginForm;
    loginForm.role = 0
    this.setData({
      loginForm: loginForm
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //这里详细注解，便于以后维护 weidingqiang
    //跳转页面进行判断
    //班级码信息 {"q":"https%3a%2f%2fx1.addsj.com%2fwx-api%2fbind%2f123456"} 
    //正常信息是 https://x1.addsj.com/wx-api/bind/123456
    //https://x1.addsj.com/wx-api/bind/00000000000000071032
    if (options.hasOwnProperty("q")) {
      let _jump = true;
      let qvalue = decodeURIComponent(options.q);

      //获取地址 "https://x1.addsj.com/api",
      let base_url = fw.config.base_url;
      //把api 替换成 wx-api
      let prefix = base_url.replace(new RegExp("api", 'g'), "wx-api/");
      //去掉前缀 https://x1.addsj.com/wx-api/
      // let prefix = "https://x1.addsj.com/wx-api/";
      let reg = qvalue.replace(new RegExp(prefix, 'g'), "");
      //剩余 bind/123456
      let targets = reg.split('/');
      this.setData({
        jump: _jump,
        jumpPage: this.data.jumpPages[targets[0]],
        jumpData: targets[1]
      })

      //1.未登录
      if (app.globalData.ticket == null || app.globalData.ticket == '') {
        switch (targets[0]) {
          case "bind":
            //跳转到家长绑定学生页面
            //这是家长账号
            //去掉密码登录
            let _loginForm = this.data.loginForm;
            _loginForm.lx = '0';
            _loginForm.role = 2;
            this.setData({
              changeRole: false,
              loginForm: _loginForm
            });
            break
        }
      } else {
        //进入首页
        wx.switchTab({
          url: '/pages/common/menu/menu1'
        })
      }
    }

    if (options.hasOwnProperty('bind') && options.hasOwnProperty('classId') && options.bind == 1) {
      this.setData({
        jump: true,
        jumpPage: this.data.jumpPages.bind,
        jumpData: options.classId
      })

      //1.未登录
      if (app.globalData.ticket == null || app.globalData.ticket == '') {
        switch (targets[0]) {
          case "bind":
            //跳转到家长绑定学生页面
            //这是家长账号
            //去掉密码登录
            let _loginForm = this.data.loginForm;
            _loginForm.lx = '0';
            _loginForm.role = 2;
            this.setData({
              changeRole: false,
              loginForm: _loginForm
            });
            break
        }
      } else {
        //进入首页
        wx.switchTab({
          url: '/pages/common/menu/menu1'
        })
      }
    }

    this.setData({
      log: JSON.stringify(options)
    })
    //fw.getWxUser()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})