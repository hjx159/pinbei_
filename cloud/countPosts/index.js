// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:"pinbei-0gwjlz0r8825e878"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.key!=="全部"){
    return await db.collection("posts").orderBy('publish_time','desc').where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
      post_tags:_.elemMatch(_.eq(event.key))
    }).count({
      success:res=>{
        console.log("计数数据库成功",res)
        return res.total
      },
      fail:res=>{
        console.log("计数数据库失败",res)
      }
    })
  }else{
    return await db.collection("posts").orderBy('publish_time','desc').where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
    }).count({
      success:res=>{
        console.log("计数数据库成功",res)
        return res.total
      },
      fail:res=>{
        console.log("计数数据库失败",res)
      }
    })
  }
}