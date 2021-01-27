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
      currentPosition: {
        latitude:26.428351, //纬度
        longitude:112.856476 //经度
      }
    },
    // 贴子信息
    post: {
      post:{
      /*   // 帖子编号（唯一）
       post_id: 0,
       post_title: result.post_title,
       post_content: result.post_content,
       // 0——吃 1——玩 2——买
       post_category: result.post_category,
       post_tags: result.post_tags,
       // 传一个Date.now()类型的数 或者数组([年,月,日,时,分,秒])
       // post_time: [2021, 1, 23, 11, 42, 51],

       // post_time: result.publish_time,                       ///变量名字待更正
       publish_time: result.publish_time,                       ///变量名字待更正

       // 微信内置api提供

       // post_position: result.position.coordinates,           ///变量名字待更正
       position: result.position,           ///变量名字待更正

       // 用户编号（唯一）
       user_id: result.user_id,
       user_name: result.user_name,
       // 用户头像路径
       user_icon: result.user_icon,
       // 图片外网路径数组
       pics_url: result.pics_url,
       // 是否结束拼单（需求满足/时限到期）
       isCompleted: result.isCompleted,
       // 点赞用户列表
       likes_list: result.likes_list,
       // 点赞个数
       likes_num: result.likes_num,
       // 评论
       comments: result.comments,
       // 文本域内容
       textVal: "" */
     },
     currentTime:0
    }
  },

  onShow: function (options) {
    //获取此时时间
    this.setData({
      currentTime:new Date().getTime()
    })

    // 获取当前小程序的页面栈（数组） 长度最大是10个页面
    let pages = getCurrentPages();
    // 数组中索引最大的就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取传入的goods_id参数
    // const { post_id, isComment } = currentPage.options;
    var post_id = JSON.parse(currentPage.options.post_id)
    var isComment = JSON.parse(currentPage.options.isComment)
    // 根据post_id获取对应帖子的信息（post对象）
    console.log("options是：",currentPage.options)
    console.log("当前帖子的post_id是：",post_id)
    wx.cloud.callFunction({
      name:"getPostInfo",
      data:{
        post_id:post_id
      },
      success:res=>{
        console.log("帖子信息返回成功，",res)
        var result = res.result.data[0]
        this.setData({
          post:{
             // 帖子编号（唯一）
            post_id: result.post_id,
            post_title: result.post_title,
            post_content: result.post_content,
            // 0——吃 1——玩 2——买
            post_category: result.post_category,
            post_tags: result.post_tags,
            // 传一个Date.now()类型的数 或者数组([年,月,日,时,分,秒])
            // post_time: [2021, 1, 23, 11, 42, 51],

            // post_time: result.publish_time,                       ///变量名字待更正
            publish_time: result.publish_time,                       ///变量名字待更正

            // 微信内置api提供

            // post_position: result.position.coordinates,           ///变量名字待更正
            position: result.position,           ///变量名字待更正

            // 用户编号（唯一）
            user_id: result.user_id,
            user_name: result.user_name,
            // 用户头像路径
            user_icon: result.user_icon,
            // 图片外网路径数组
            pics_url: result.pics_url,
            // 是否结束拼单（需求满足/时限到期）
            isCompleted: result.isCompleted,
            // 点赞用户列表
            likes_list: result.likes_list,
            // 点赞个数
            likes_num: result.likes_num,
            // 评论
            comments: result.comments,
            // 文本域内容
            textVal: ""
          }
        })
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
        console.log("post,",post)
        const MyId = this.data.MyInfo.user_id;
        /* console.log("post.likes_list:",post.likes_list)
        console.log("post.comments.comments_list[i].likes_list",post.comments.comments_list[i].likes_list) */
        isLike = post.likes_list.some(v => v === MyId);
        for (var i = 0; i < post.comments.comments_num; i++) {
          commentsIsLike[i] = post.comments.comments_list[i].likes_list.some(v => v === MyId);
        }
        this.setData({
          isLike,
          commentsIsLike
        });
      },
      fail:err=>{
        console.log("帖子信息返回失败，",err)
      }
    })
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