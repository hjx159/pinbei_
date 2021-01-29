let timeLimit = 1080000000//时间限度为300个小时
let numOfPostsOneTime = 5//上拉加载，每次5条
let totalNum = 0//帖子总数（用于分页）
let index = 0
let keywords=[]
let isTab = false
let isEnd = false
let max = 4000//距离用户的最大距离为：4km
const db = wx.cloud.database()
const _ = db.command
var app = getApp()
// app.globalData.userInfo
// posts countPosts isLike swiperImgs len
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
    swiperImgs: [],
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
    // 用户个人信息
    MyInfo: {
      // 用户编号（唯一）
      user_id: 20210123,
      user_name: "XWH",
      // 用户头像路径
      user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132",
      // 当前地理位置  
      currentPosition: {
        latitude:0, //纬度
        longitude:0 //经度
      }
    },
    // 满足条件的帖子（数组）
    postsList: [],
    currentTime:0,
  },
  getSwiperImgs(){
    let imgArr = []
    wx.cloud.database().collection("swiperImgs").get({
      success:res=>{
        // console.log("请求轮播图成功",res.data)
        let dataList = res.data
        for(let i = 0 ;i<dataList.length;i++){
          imgArr.push(dataList[i].url)
        }
        // console.log("imgArr数组为：",imgArr)
        this.setData({
          swiperImgs:imgArr
        })
      },
      fail:err=>{
        console.log("请求轮播图失败",err)
      }
    })
  },
  onLoad(){
    console.log(new Date().getTime())
    this.setData({
      MyInfo:{
        currentPosition:{
          latitude:26.428351,
          longitude:112.856476
        }
      }
    })
    // console.log("当前用户的纬度、经度是：",this.data.MyInfo.currentPosition)
    
    //获取用户的地理位置
    /* wx.getLocation({
      type: 'gcj02',
      success:res=> {
          this.setData({
            MyInfo:{
              currentPosition:{
                latitude:res.latitude,
                longitude:res.longitude
              }
            }
          })
          console.log("当前用户的纬度、经度是：",this.data.MyInfo.currentPosition)
      },
      fail:err=>{
        console.log("获取用户地理位置失败",err)
      }
  }) */


    const time = Date.now()
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    wx.cloud.callFunction({
      name:"countPosts",
      data:{
        longitude:this.data.MyInfo.currentPosition.longitude,
        latitude:this.data.MyInfo.currentPosition.latitude,
        maxDistance:max,
        timelimit:time_,
        key:"全部"
      },success:res=>{
        // console.log(res.result.data)
        totalNum=res.result.data.length
        console.log("countPosts云函数返回：totalNum计算成功",totalNum)
        let { keywords } = this.data;
        keywords.forEach(v => v.isActive = (v.id === 0) ? true : false);
        this.setData({
          keywords
        })
        this.getPagingData()
      },fail:err=>{
        console.log("countPosts云函数返回：totalNum计算失败.",err)
      }
    })
    
  },

  onShow() {
    // 发送请求 默认得到 三公里以内 吃 全部 对应的posts数组 以及 吃 对应的keywords数组
    let isLike = [];
    let { postsList } = this.data;
    const MyId = this.data.MyInfo.user_id;
    for (var i = 0; i < postsList.length; i++) {
      isLike[i] = postsList[i].likes_list.some(v => v === MyId);
    }
    this.setData({
      isLike
    })

    this.getSwiperImgs()
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
    console.log(app.globalData.userInfo)
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
        longitude:this.data.MyInfo.currentPosition.longitude,
        latitude:this.data.MyInfo.currentPosition.latitude,
        maxDistance:max,
        timelimit:time_,
        key:keywords[index].value
      },success:res=>{
        // console.log(res)
        totalNum=res.result.data.length
        console.log("countPosts云函数返回：totalNum计算成功,当前tab的帖子总数是:",totalNum)
        this.getPagingDataForTab()
      },fail:err=>{
        console.log("countPosts云函数返回：totalNum计算失败.",err)
      }
    })
  },

  // 点击点赞
  handleTapLike(e) {
    const { index } = e.currentTarget.dataset;
    let { postsList, isLike } = this.data;
    const MyId = this.data.MyInfo.user_id;
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

  // 下拉刷新事件
  onPullDownRefresh() {
    const time1 = Date.now()
    this.setData({
      currentTime:time1
    })
    const time_ = this.data.currentTime - timeLimit

    wx.cloud.callFunction({
      name:"countPosts",
      data:{
        longitude:this.data.MyInfo.currentPosition.longitude,
        latitude:this.data.MyInfo.currentPosition.latitude,
        maxDistance:max,
        timelimit:time_,
        key:"全部"
      },success:res=>{
        // console.log(res.result.data)
        totalNum=res.result.data.length
        console.log("countPosts云函数返回：totalNum计算成功",totalNum)
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
      },fail:err=>{
        console.log("countPosts云函数返回：totalNum计算失败.",err)
      }
    })

    
  },

  // 页面上划 滚动条触底事件
  onReachBottom() {
    let len = this.data.postsList.length
    console.log("totalNum:",totalNum,";len:",len)
    if(!isTab&&!isEnd){
      console.log("'全部'页滑到底部，数据更新!")
      this.getPagingData()
    }else if(isTab&&!isEnd){
      console.log("'特定'页滑到底部，数据更新!")
      this.getPagingDataForTab()
    }
    isEnd=false
  },

  getPagingData(){
    let len = this.data.postsList.length
    if(totalNum===0){
      wx.showToast({
        title: '当前时间距离范围内无帖子您可以对其设置',
        icon:'none',
        duration:3000
      })
      wx.showActionSheet({
        // alertText:"当前时间、距离范围内无帖子\n您可以对其进行设置",
        itemList: ['设置时间', '设置距离', '设置时间和距离'],
        success (res) {
          console.log(res.tapIndex)
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
      return
    }
    if(totalNum==len&&totalNum!=0){
      wx.showToast({
        title: '数据加载完毕',
      })
      isEnd=true
      console.log("当前的totalNum和len分别是：",totalNum,len,"，下拉刷新返回！")
      return
    }
    // console.log(totalNum,len)
    wx.showLoading({
      title: '拼命加载中！！',
    })

    const time = Date.now()
    // console.log(time)
    this.setData({
      currentTime:time
    })
    const time_ = this.data.currentTime - timeLimit

    wx.cloud.callFunction({
      name:"getPostList",
      data:{
        longitude:this.data.MyInfo.currentPosition.longitude,
        latitude:this.data.MyInfo.currentPosition.latitude,
        maxDistance:max,
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
    
    if(totalNum===0){
      wx.showToast({
        title: '当前时间距离范围内无帖子您可以对其设置',
        icon:'none',
        duration:3000
      })
      wx.showActionSheet({
        // alertText:"当前时间、距离范围内无帖子\n您可以对其进行设置",
        itemList: ['设置时间', '设置距离', '设置时间和距离'],
        success (res) {
          console.log(res.tapIndex)
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
      return
    }

    if(totalNum==len&&totalNum!=0){
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
        longitude:this.data.MyInfo.currentPosition.longitude,
        latitude:this.data.MyInfo.currentPosition.latitude,
        maxDistance:max,
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
})
