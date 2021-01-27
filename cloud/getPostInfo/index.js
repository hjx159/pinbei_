// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:"pinbei-0gwjlz0r8825e878"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("test1").where({
    // post_id:_.eq(event.post_id)
    post_id:event.post_id
  }).get({
    success:res=>{
      console.log("返回帖子详情成功",res)
    },
    fail:res=>{
      console.log("返回帖子详情失败",res)
    }
  })
}