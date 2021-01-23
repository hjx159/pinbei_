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
    postsList: [
      {
        // 帖子编号（唯一）
        post_id: 123,
        post_title: "CoCo打五折，买一送一！！",
        post_content: "我想喝奶茶了，有想拼单的评论或者直接私聊我!",
        // 0——吃 1——玩 2——买
        post_category: 0,
        post_tags: ["CoCo", "奶茶拼单"],
        // 传一个Date.now()类型的数 或者数组([年,月,日,时,分,秒])
        // post_time: [2021, 1, 23, 11, 42, 51],
        post_time: "10分钟前",
        // 微信内置api提供
        post_position: "距您200m",
        // 用户编号（唯一）
        user_id: 20210123,
        user_name: "XWH",
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
          likes_num: 1,
          comments_num: 1,
          comments_list: [
            {
              comment_id: 1,
              comment_content: "dd",
              user_name: "XWH",
              user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132"
            }
          ]
        }
      },
      {
        // 帖子编号（唯一）
        post_id: 124,
        post_title: "喜茶买二送一！！",
        post_content: "我想喝奶茶了，有想拼单的评论或者直接私聊我!",
        // 0——吃 1——玩 2——买
        post_category: 0,
        post_tags: ["喜茶", "奶茶拼单"],
        // 传一个Date.now()类型的数 或者数组([年,月,日,时,分,秒])
        // post_time: [2021, 1, 23, 11, 42, 51],
        post_time: "1分钟前",
        // 微信内置api提供
        post_position: "距您500m",
        // 用户编号（唯一）
        user_id: 20210129,
        user_name: "XXX",
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
      }
    ]
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
    const { index } = e.currentTarget.dataset;
    let { keywords } = this.data;
    keywords.forEach(v => v.isActive = (v.id === index) ? true : false);
    this.setData({
      keywords
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

  },

  // 页面上划 滚动条触底事件
  onReachBottom() {

  },

  // 获取商品列表数据
  async getPostsList() {

  }
})
