// pages/post/post.js
Page({

  // 页面的初始数据
  data: {
    postInfo:{}
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    //获取帖子信息
    wx.cloud.callFunction({
      name:"getPostInfo",
      data:{
        post_id:1611457831025 //改为当前帖子的post_id
      },success:res=>{
        console.log("返回的帖子信息是",res.result.data[0])
        this.setData({
          postInfo:res.result.data[0]
        })
      },fail:err=>{
        console.log("返回帖子信息失败",err)
      }
    })
    //后续操作...
  },
  //获取用户open_id按钮
  tapHandler(){
    wx.cloud.callFunction({
      name:"getOpenid",
      success:res=>{
        console.log("返回的openid为：",res.result.openid)
      }
    })
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