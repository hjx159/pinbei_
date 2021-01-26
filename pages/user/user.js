Page({
  data: {
    // 用户个人信息
    userInfo: {}
  },

  onLoad: function (options) {
    // 获得用户个人信息
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    });
  },

  // 点击登录按钮 获得用户信息
  handleGetUserInfo(e) {
    // 还要拿到用户的openid和当前位置
    console.log(e.detail);
    const { userInfo } = e.detail;
    this.setData({
      userInfo
    });
    wx.setStorageSync("userInfo", userInfo);
  }
})