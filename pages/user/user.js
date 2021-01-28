Page({
  data: {
    // 用户个人信息
    userInfo: {}
  },

  onLoad: function (options) {
    // 获得用户个人信息
    const userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    this.setData({
      userInfo
    });
  },

  // 点击登录按钮 获得用户信息
  handleGetUserInfo(e) {
    console.log(e.detail);
    const { userInfo } = e.detail;
    this.setData({
      userInfo
    });
    // 还要拿到用户的openid和当前位置
    wx.cloud.callFunction({
      name:"getOpenid",
      success:res=>{
        console.log("云函数getOpenid返回：",res.result.openid)
        userInfo.user_id=res.result.openid
        this.setData({
          userInfo:userInfo
        })
        console.log("当前userInfo为：",this.data.userInfo)
      }
    })
    
    wx.setStorageSync("userInfo", userInfo);
  }
})