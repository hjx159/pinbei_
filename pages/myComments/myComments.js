// pages/myComments/myComments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MyInfo: {},
    PostListOfMyComments:[],
  },

  onLoad(){
    this.setData({
      // MyInfo:app.globalData.userInfo
      MyInfo:wx.getStorageSync('userInfo')
    })
    console.log(this.data.MyInfo)
    
    //查询当前用户评论过的帖子
    wx.cloud.callFunction({
      name:"getMyComments",
      data:{
        user_id:this.data.MyInfo.user_id
      }, 
      success:res=>{
        console.log("返回我的评论成功！",res)
        this.setData({
          PostListOfMyComments:res.result.data
        })
      },
      fail:err=>{
        console.log("返回我的评论失败！",err)
      }
    })
  }
})