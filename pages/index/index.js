let timeLimit = 108000000//时间限度为30个小时
let numOfPostsOneTime = 5//上拉加载，每次10条
let totalNum = -1//帖子总数（用于分页）
let index = 0
let keywords=[]
const _ = wx.cloud.database().command
let isTab = false
let isEnd = false
// let booL = false
Page({
  data: {
    // tab栏数据
    tabs: [
      {
        id: 0,
        value: "吃",
        isActive: true
      },
      {
        id: 1,
        value: "玩",
        isActive: false
      },
      {
        id: 2,
        value: "买",
        isActive: false
      }
    ],
    // 轮播图图片链接
    swiperImgs: [
      "https://img.alicdn.com/imgextra/i4/2206686532409/O1CN01zH1kdr1TfMmFLfAFU_!!2206686532409-0-lubanimage.jpg",
      "https://img.alicdn.com/imgextra/i2/2206686532409/O1CN01c5CYFS1TfMmLOdpj5_!!2206686532409-0-lubanimage.jpg",
      "https://img.alicdn.com/imgextra/i2/2206686532409/O1CN01uZ1QzJ1TfMmIonq0u_!!2206686532409-0-lubanimage.jpg"
    ],
    // 关键词推荐
    keywords: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "奶茶",
        isActive: false
      },
      {
        id: 2,
        value: "披萨",
        isActive: false
      },
      {
        id: 3,
        value: "炸鸡",
        isActive: false
      }
    ],
    // 满足条件的帖子（数组）
    postsList: [],
    currentTime:0
  },

  onShow() {
    // 发送请求 默认得到 三公里以内 吃 全部 对应的posts数组 以及 吃 对应的keywords数组
  },

  // 标题点击事件 改变标题并发送对应请求 从而改变posts数组
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail;
    // 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值到data中
    this.setData({
      tabs
    });
  },

  // tab栏点击
  handlekeywordsItemChange(e) {
    // booL=true
    this.setData({
      postsList:[]
    })

    index = e.currentTarget.dataset.index;

    if(index===0){
      isTab=false
      console.log(isTab)
    }else{
      isTab=true
      console.log(isTab)
    }

    keywords = this.data.keywords;
    keywords.forEach(v => v.isActive = ((v.id === index) ? true : false));
    this.setData({
      keywords:keywords
    })

    const time = Date.now()
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    
    wx.cloud.callFunction({
      name:"countPosts",
      data:{
        timelimit:time_,
        key:keywords[index].value
      },success:res=>{
        totalNum=res.result.total
        console.log("totalNum计算成功,当前tab的帖子总数是:",totalNum)
        this.getPagingDataForTab()
      },fail:err=>{
        console.log("totalNum计算失败.",err)
      }
    })
    
    
  },

  // 点击点赞
  handleTapLike(e) {
    const { index } = e.currentTarget.dataset;
    let { postsList } = this.data;
    if (postsList[index].isLike) {
      postsList[index].comments.likes_num--;
      postsList[index].isLike = false;
    } else {
      postsList[index].comments.likes_num++;
      postsList[index].isLike = true;
    }
    this.setData({
      postsList
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

  // 下拉刷新事件
  onPullDownRefresh() {
    
    const time = Date.now()
    this.setData({
      currentTime:time
    })

    this.setData({
      postsList:[]
    })

    keywords = this.data.keywords;
    keywords.forEach(v => v.isActive = ((v.id === 0) ? true : false));
    this.setData({
      keywords:keywords
    })

    //wx.startPullDownRefresh()
    // if(index===0){
      isTab=false
      this.getPagingData()
    /* }else{//有点问题
      isTab=true
      const time = Date.now()
      this.setData({
        currentTime:time
      })
      const time_ = this.data.currentTime - timeLimit

      
      wx.cloud.callFunction({
        name:"countPosts",
        data:{
          timelimit:time_,
          key:keywords[index].value
        },success:res=>{
          totalNum=res.result.total
          console.log("totalNum计算成功,当前tab的帖子总数是:",totalNum)
          this.getPagingDataForTab()
        },fail:err=>{
          console.log("totalNum计算失败.",err)
        }
      })
      isTab=false
      this.getPagingDataForTab()
    } */
    wx.stopPullDownRefresh()
  },

  // 页面上划 滚动条触底事件
  onReachBottom() {
    console.log("isTab:",isTab,";isEnd:",isEnd)
    if(!isTab&&!isEnd){
      console.log("'全部'页滑到底部，数据更新!")
      this.getPagingData()
    }else if(isTab&&!isEnd){
      console.log("'特定'页滑到底部，数据更新!")
      this.getPagingDataForTab()
    }
    isEnd=false
  },

  // 获取商品列表数据
  /* async getPostsList() {

  }, */
  
  getPagingData(){
    let len = this.data.postsList.length
    if(totalNum==len){
      wx.showToast({
        title: '数据加载完毕',
      })
      isEnd=true
      return
    }
    console.log(totalNum,len)
    wx.showLoading({
      title: '拼命加载中！！',
    })

    const time = Date.now()
    console.log(time)
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    wx.cloud.callFunction({
      name:"getPostList",
      data:{
        numOfPostsOneTime:numOfPostsOneTime,
        len:len,
        action:"shouye",
        key:"全部",
        timelimit:time_
      },
      success:res=>{
        wx.hideLoading()
        this.setData({
          postsList:this.data.postsList.concat(res.result.data)
        })
      },
      fail:err=>{
        console.log("数据库查询失败",err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },
  getPagingDataForTab(){
    const time = Date.now()
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    let len = this.data.postsList.length
    
    if(totalNum==len){
      wx.showToast({
        title: '数据加载完毕',
      })
      isEnd=true
      return
    }
    wx.showLoading({
      title: '拼命加载中！！',
    })
    wx.cloud.callFunction({
      name:"getPostList",
      data:{
        numOfPostsOneTime:numOfPostsOneTime,
        len:len,
        action:"shouye",
        key:keywords[index].value,
        timelimit:time_
      },
      success:res=>{
        wx.hideLoading()
        console.log("数据库查询成功",res)
        
        /* 这段代码可以防止用户脑溢血疯狂点击某个标签，如“奶茶”
        避免此时帖子列表加载重复
        但是，这段代码会使得某个标签的帖子不能够分页加载
        所以还是注释掉了  */
        /* if(booL){
          this.setData({
            postsList:[]
          })
          booL=false
      } */
        this.setData({
          postsList:this.data.postsList.concat(res.result.data)
        })
      },
      fail:err=>{
        console.log("数据库查询失败",err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
      }
    })
  },
  onLoad(){
    const time = Date.now()
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    wx.cloud.callFunction({
      name:"countPosts",
      data:{
        timelimit:time_,
        key:"全部"
      },success:res=>{
        console.log("totalNum计算成功",totalNum)
        totalNum=res.result.total
      },fail:err=>{
        console.log("totalNum计算失败.",err)
      }
    })
    let { keywords } = this.data;
    keywords.forEach(v => v.isActive = (v.id === 0) ? true : false);
    this.setData({
      keywords
    })
    this.getPagingData()
  },
  onShow(){
    /* wx.cloud.database().collection("posts").add({
      data:{
        // 帖子编号（唯一）
        post_id: new Date().getTime(),
        post_title: "奶茶999！！",
        post_content: "快来吧!",
        // 0——吃 1——玩 2——买
        post_category: 0,
        post_tags: ["奶茶", "奶茶拼单"],
        // 传一个Date.now()类型的数 或者数组([年,月,日,时,分,秒])
        // post_time: [2021, 1, 23, 11, 42, 51],
       // post_time: "1分钟前",
        publish_time:new Date().getTime(),
        // 微信内置api提供
        post_position: "距您500m",
        // 用户编号（唯一）
        user_id: 20210118,
        user_name: "Jay",
        // 用户头像路径
        user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132",
        // 图片外网路径数组
        pics_url: [
          "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132"
        ],
        // 是否结束拼单（需求满足/时限到期）
        isCompleted: false,
        // 是否已点赞
        isLike: false,
        // 评论
        comments: {
          likes_num: 0,
          comments_num: 0,
          comments_list: [
            {
              comment_id: 1,
              comment_content: "dd",
              user_name: "XXX",
              user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132"
            }
          ]
        }
      },
      success:res=>{
        console.log("成功插入云数据库",res)
      },
      fail:err=>{
        console.log("失败插入云数据库",err)
      }
    }) */

    /* let { keywords } = this.data;
    keywords.forEach(v => v.isActive = (v.id === 0) ? true : false);
    this.setData({
      keywords
    })
    this.getPagingData() */
  }
})
