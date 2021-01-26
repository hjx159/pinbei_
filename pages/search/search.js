Page({
  data: {
    posts: [],
    // 取消按钮是否显示 
    isFocus: false,
    // 输入框的值
    inputValue: "",
    recommends: [
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
      }, {
        id: 3,
        value: "折扣",
        isActive: false
      },
      {
        id: 4,
        value: "奶茶",
        isActive: false
      },
      {
        id: 5,
        value: "衣服",
        isActive: false
      },
      {
        id: 6,
        value: "拼船",
        isActive: false
      }
    ],
    // 选择的推荐词
    chooseRec: []
  },
  // 定时器防止抖动
  TimeId: -1,
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail;
    clearTimeout(this.TimeId);
    // 检验合法性
    if (!value.trim()) {  // 输入为空
      this.setData({
        posts: [],
        isFocus: false,
        inputValue: ""
      })
      return;
    }
    this.setData({
      isFocus: true,
      inputValue: value
    })
    this.TimeId = setTimeout(() => {
      this.searchByInputVal(this.data.inputValue);
    }, 1000);
  },

  // 点击取消按钮
  handleCancel() {
    this.setData({
      isFocus: false,
      inputValue: "",
      posts: []
    })
  },

  // 点击选择推荐词
  handleChooseRecommendsItem(e) {
    const { index } = e.currentTarget.dataset;
    let { recommends, chooseRec } = this.data;
    recommends.forEach(v => {
      if (v.id === index) {
        v.isActive = !v.isActive;
        const rec = v.value;
        if (v.isActive !== true) {
          const i = chooseRec.findIndex(v => v === rec);
          chooseRec.splice(i, 1);
        } else {
          chooseRec.push(rec);
        }
      }
    });
    this.setData({
      recommends,
      chooseRec
    })
    if (chooseRec.length !== 0) {
      this.searchByChooseRecommends(chooseRec);
    } else {
      this.setData({
        posts: []
      })
    }
  },

  // 根据输入的关键词
  searchByInputVal(value) {
    // 获取相关帖子

    this.setData({
      posts: [
        {
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
          post_position: "距您200m"
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
          post_position: "距您500m"
        }
      ]
    })
  },

  // 根据选择的推荐词
  searchByChooseRecommends(value) {
    // 获取相关帖子

    this.setData({
      posts: [
        {
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
          post_position: "距您200m"
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
          post_position: "距您500m"
        }
      ]
    })
  }

})