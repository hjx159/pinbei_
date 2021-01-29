var app = getApp()
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
    // 获取openid作为用户id
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
    //获取用户当前位置
    wx.getLocation({
      type: 'gcj02',
      success:res=> {
        console.log(res)
        userInfo.position={
          longitude:res.longitude,
          latitude:res.latitude,
        }
        this.setData({
          userInfo:userInfo
        })
        console.log(this.data.userInfo)
        /* wx.cloud.callFunction({
          name:"addUserInfo",
          data:{
            userInfo:userInfo
          },
          success:res=>{
            console.log("添加用户信息至数据库成功",res)
          },
          fail:err=>{
            console.log("添加用户信息至数据库失败",err)
          }
        }) */
        app.globalData.userInfo=userInfo
        console.log(app.globalData.userInfo)
        wx.setStorageSync("userInfo", userInfo);
      },
      fail:err=>{
        console.log("获取用户地理位置失败",err)
      }
    })
  },
  handleTapmyPosts(e){
    wx.navigateTo({
      url: '/pages/myPosts/myPosts'
    });
   }
})