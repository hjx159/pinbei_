// pages/myPosts/myPosts.js
let index=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    MyInfo:{},
    currentTime:0
  },

  getPosts(){
    const time = Date.now()
    this.setData({
       currentTime:time
    })

    this.setData({
      MyInfo:wx.getStorageSync('userInfo')
    })
    
    wx.cloud.callFunction({
      name:"getMyPosts",
      success:res=>{
        console.log("查找成功",res)
        this.setData({
          list:res.result.data
        })
      },
      fail:res=>{
        console.log("查找失败",res)
      }
      
    })

  },
    // 点击点赞
    handleTapLike(e) {
      const { index } = e.currentTarget.dataset;
      if (isLike[index]) {
        let i = postsList[index].likes_list.findIndex(v => v === MyId);
        postsList[index].likes_list.splice(i, 1);
        postsList[index].likes_num--;
        isLike[index] = false;
      } else {
        postsList[index].likes_list.push(MyId);
        postsList[index].likes_num++;
        isLike[index] = true;
      }
      this.setData({
        postsList,
        isLike
      });
    },
  
    // 点击评论
    handleTapComment(e) {
      const { index } = e.currentTarget.dataset;
      let { postsList } = this.data;
      wx.navigateTo({
        url: '/pages/post/post?post_id=' + postsList[index].post_id + '&isComment=true'
      });
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPosts()
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