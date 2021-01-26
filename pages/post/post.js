Page({
  data: {
    // 用户个人信息
    MyInfo: {
      // 用户编号（唯一）
      user_id: 20210123,
      user_name: "XWH",
      // 用户头像路径
      user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132",
      // 当前地理位置  
      currentPosition: ""
    },
    // 贴子信息
    post: {
      // 帖子编号（唯一）
      post_id: 123,
      post_title: "CoCo打五折，买一送一！！",
      post_content: "想喝奶茶啦，有想一块儿拼单的评论或者直接私聊我!",
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
        "https://i2.hdslb.com/bfs/face/ab919f110f6511bf879812ef39594dc29deed522.jpg@140w_140h_1c.jpg",
        "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132"
      ],
      // 是否结束拼单（需求满足/时限到期）
      isCompleted: false,
      // 点赞用户列表
      likes_list: [20210123],
      // 点赞个数
      likes_num: 1,
      // 评论
      comments: {
        comments_num: 1,
        comments_list: [
          {
            comment_id: 1,
            comment_content: "dd",
            comment_time: "3分钟前",
            user_name: "XWH",
            user_icon: "https://thirdwx.qlogo.cn/mmopen/vi_32/V1Af82fG1XWgLduic37AbvxicNkzSCAiasQ4W8ibViatccFgPf2b2Nzx3UqZhMqMQJFpGUFDiaBaAZx23bwenuZ7wwLA/132",
            // 点赞用户列表
            likes_list: [20210112],
            // 点赞个数
            likes_num: 1
          }
        ]
      },
      // 文本域内容
      textVal: ""
    }
  },

  onShow: function (options) {
    // 获取当前小程序的页面栈（数组） 长度最大是10个页面
    let pages = getCurrentPages();
    // 数组中索引最大的就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取传入的goods_id参数
    const { post_id, isComment } = currentPage.options;
    // 根据post_id获取对应帖子的信息（post对象）

    // 按isComment来决定是否划动页面至评论区
    // 若没有那么多评论 则滑动至底部后停止 不会报错
    if (isComment == "true") {
      wx.createSelectorQuery().select("#comment").boundingClientRect(function (res) {
        wx.pageScrollTo({
          scrollTop: res.top,
          duration: 500
        });
      }).exec();
    }

    // 帖子是否点赞
    let isLike = false;
    // 评论是否点赞
    let commentsIsLike = [];
    let { post } = this.data;
    const MyId = this.data.MyInfo.user_id;
    isLike = post.likes_list.some(v => v === MyId);
    for (var i = 0; i < post.comments.comments_num; i++) {
      commentsIsLike[i] = post.comments.comments_list[i].likes_list.some(v => v === MyId);
    }
    this.setData({
      isLike,
      commentsIsLike
    });
  },

  // 点击下方工具栏中爱心
  handleTapLike() {
    let { post, isLike } = this.data;
    const MyId = this.data.MyInfo.user_id;
    if (isLike) {
      let i = post.likes_list.findIndex(v => v === MyId);
      post.likes_list.splice(i, 1);
      post.likes_num--;
      isLike = false;
    } else {
      post.likes_list.push(MyId);
      post.likes_num++;
      isLike = true;
    }
    this.setData({
      post,
      isLike
    });
  },

  //点赞评论
  handleTapCommentsLike(e) {
    const { index } = e.currentTarget.dataset;
    let { post, commentsIsLike } = this.data;
    const MyId = this.data.MyInfo.user_id;
    if (commentsIsLike[index]) {
      let i = post.comments.comments_list[index].likes_list.findIndex(v => v === MyId);
      post.comments.comments_list[index].likes_list.splice(i, 1);
      post.comments.comments_list[index].likes_num--;
      commentsIsLike[index] = false;
    } else {
      post.comments.comments_list[index].likes_list.push(MyId);
      post.comments.comments_list[index].likes_num++;
      commentsIsLike[index] = true;
    }
    this.setData({
      post,
      commentsIsLike
    });
  },

  // 点击预览图片
  handlePreviewImg(e) {
    // 构造要预览的图片数组
    const { pics_url } = this.data.post;
    // 接收传递过来的图片url
    const currentURL = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentURL, // 当前显示图片的http链接
      urls: pics_url // 需要预览的图片http链接列表
    })
  },

  // 文本框输入
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 评论
  handleComment() {
    let { post, MyInfo, textVal } = this.data;
    let MyComment = {
      comment_id: post.comments.comments_num,
      comment_content: textVal,
      comment_time: "1秒钟前",
      user_name: MyInfo.user_name,
      user_icon: MyInfo.user_icon,
      likes_list: [],
      likes_num: 0
    }
    post.comments.comments_num++;
    post.comments.comments_list.push(MyComment);
    textVal = "";
    this.setData({
      post,
      textVal
    });
  },

  // 点击私聊按钮
  handleChat() {

  }
})