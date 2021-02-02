// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:"pinbei-0gwjlz0r8825e878"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  
  return await db.collection("test1").where({
    'comments.comments_list.user_id':_.eq(event.user_id)
  }).get({
    success:res=>{
      console.log("返回用户评论过的帖子成功",res)
    },
    fail:res=>{
      console.log("返回用户评论过的帖子失败",res)
    }
  })
}