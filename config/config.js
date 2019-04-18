var config = {
  //服务器地址
  base_url: "https://www.wanandroid.com",
  //默认页面 一般设置登录相关
  defaultRoute:"",
  //黑盒和白盒
  access: {
    black: ["pages/*"],
    white: []
  }
}

module.exports = config