// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  cloud.database().collection("posts").add({
    data:{
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
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })
}