const db = wx.cloud.database()
Page({
  data: {
    // 用户个人信息
    MyInfo: {},
    // cates栏数据
    cates: [
      {
        id: 0,
        value: "吃",
        isActive: false
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
    // 关键词推荐
    keywords: [
      {
        id: 0,
        value: "折扣",
        isActive: false
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
    // 帖子标题内容
    titleTextVal: "",
    // 帖子主体内容
    contentTextVal: "",
    // 选择的图片路径数组
    chooseImgs: [],
    // 帖子销毁时间
    delTime: "",
    // 当前是否自定义标签
    DIY: false,
    // 自定义标签内容
    DIYTextVal: ""
  },

  onShow: function (options) {
    if(!wx.getStorageSync('userInfo').user_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none',
      })
      setTimeout(function(){
        wx.switchTab({
        url: '../user/user',
        })
      }
      ,2000)
    }else{
      // 获取用户信息并赋值到data中
      this.setData({
        // MyInfo:app.globalData.userInfo
        MyInfo:wx.getStorageSync('userInfo')
      })
      console.log(this.data.MyInfo)
    }
  },

  // 标题输入事件
  handleTitleInput(e) {
    this.setData({
      titleTextVal: e.detail.value
    })
  },

  // 内容输入事件
  handleContentInput(e) {
    this.setData({
      contentTextVal: e.detail.value
    })
  },

  // 点击加号选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9 - this.data.chooseImgs.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },

  // 点击自定义图片组件 移除该图片
  handleRemoveImg(e) {
    wx.showModal({
      title: '要删除这张图片吗？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          const { index } = e.currentTarget.dataset;
          let { chooseImgs } = this.data;
          chooseImgs.splice(index, 1);
          this.setData({
            chooseImgs
          });
        }
      }
    });
  },

  // 选择类别
  handleTapCatesItem(e) {
    const { index } = e.currentTarget.dataset;
    let { cates } = this.data;
    cates.forEach(v => v.isActive = (v.id === index) ? true : false);
    this.setData({
      cates
    })
  },

  // 选择标签
  handleTapKeywordsItem(e) {
    const { index } = e.currentTarget.dataset;
    let { keywords } = this.data;
    keywords.forEach(v => {
      if (v.id === index)
        v.isActive = !v.isActive;
    });
    this.setData({
      keywords
    })
  },

  // 自定义标签
  handleAddKeywordsItem() {
    this.setData({
      DIY: true
    })
  },

  // 自定义标签输入
  handleDIYinput(e) {
    this.setData({
      DIYTextVal: e.detail.value
    })
  },

  // 自定义标签输入框失去焦点
  handleBlur() {
    if (!this.data.DIYTextVal.trim()) {
      this.setData({
        DIY: false,
        DIYTextVal: ""
      })
    }
  },

  // 自定义标签完成
  handleDIYfinished() {
    console.log(this.data.DIYTextVal.trim());
    if (!this.data.DIYTextVal.trim()) {
      wx.showToast({
        title: '自定义标签内容不能为空',
        icon: 'none',
        mask: true
      });
      this.setData({
        DIY: false,
        DIYTextVal: ""
      })
    } else {
      const { keywords, DIYTextVal } = this.data;
      let DIYtag = {
        id: keywords.length,
        value: DIYTextVal,
        isActive: true
      }
      keywords.push(DIYtag);
      this.setData({
        keywords,
        DIY: false,
        DIYTextVal: ""
      })
    }
  },

  // 选择帖子销毁时间
  handlePostTime() {
    // 跳转到定时页面
    wx.navigateTo({
      url: '/pages/setTime/setTime'
    });
    // 从缓存中获取帖子销毁时间 并存入data
    this.setData({
      delTime: "1小时后"
    })
  },

  // 点击发送按钮
  handleSubmit() {
    if (!this.data.titleTextVal.trim()) {
      // 判断活动标题是否合法（不为空）
      wx.showToast({
        title: '活动标题不能为空',
        icon: 'none',
        mask: true
      });
    } else if (!this.data.contentTextVal.trim()) {
      // 判断帖子内容是否合法（不为空）
      wx.showToast({
        title: '帖子内容不能为空',
        icon: 'none',
        mask: true
      });
    } else if (!this.data.cates.some(v => v.isActive === true)) {
      // 判断贴子类别是否合法（不为空）
      wx.showToast({
        title: '帖子类别不能为空',
        icon: 'none',
        mask: true
      });
    } else {
      // 准备发送帖子
      wx.showLoading({
        title: "正在上传中",
        mask: true
      });
      // 整理tags数组
      let tags = [];
      for (var i = 0; i < this.data.keywords.length; i++) {
        if (this.data.keywords[i].isActive) {
          tags[tags.length] = this.data.keywords[i].value;
        }
      }
      // 将图片数组上传 转化并存储为外网链接
      let UploadImgs = [];
      if (this.data.chooseImgs.length !== 0) {
        this.data.chooseImgs.forEach((v, i) => {
          var upTask = wx.uploadFile({
            url: 'https://img.coolcr.cn/api/upload',
            filePath: v,
            name: "image",
            formData: {},
            success: (result) => {
              let url = JSON.parse(result.data).data.url;
              UploadImgs.push(url);

              // 上传完毕
              if (i === UploadImgs.length - 1) {
                wx.hideLoading();
              }
            }
          });
        })
      } else {
        wx.hideLoading();
      }
      // 整理帖子内容 并发送到后台
      let myPost = {
        post_id: new Date().getTime(),
        post_title: this.data.titleTextVal,
        post_content: this.data.contentTextVal,
        post_category: this.data.cates.findIndex(v => v.isActive === true),
        post_tags: tags,
        // post_time: "",
        publish_time:new Date().getTime(),
        // post_position: "",
        // position:要借助全局数据结构MyInfo,
        // position:this.data.MyInfo.position,
        /* position:{
          longitude:this.data.MyInfo.position.longitude,
          latitude:this.data.MyInfo.position.latitude,
        }, */
        position:db.Geo.Point(this.data.MyInfo.position.longitude,this.data.MyInfo.position.latitude),
        user_id: this.data.MyInfo.user_id,
        user_name: this.data.MyInfo.nickName,
        user_icon: this.data.MyInfo.avatarUrl,

        pics_url: UploadImgs,
        delTime: this.data.delTime,
        isCompleted: false,
        likes_list: [],
        likes_num: 0,
        comments: {
          comments_num: 0,
          comments_list: []
        },
      };
      
      //将myPost数据结构添加到数据库中
      wx.cloud.callFunction({
        name:"addPosts",
        data:{
          myPost:myPost
        },
        success:res=>{
          console.log("帖子数据成功添加到数据库内",res)
          // 清空页面内容
          this.setData({
            titleTextVal: "",
            contentTextVal: "",
            chooseImgs: [],
            cates: [
              {
                id: 0,
                value: "吃",
                isActive: false
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
            keywords: [
              {
                id: 0,
                value: "买二送一",
                isActive: false
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
            delTime: ""
          })
          console.log(myPost);
          //帖子发送后，跳转到首页
          wx.switchTab({
            url: '../index/index',
          })
        },
        fail:err=>{console.log("帖子数据未能发送到数据库中",err)}
      })
    }
  }
})