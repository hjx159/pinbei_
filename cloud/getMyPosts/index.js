// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"pinbei-0gwjlz0r8825e878"
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  //查询数据库中与用户id相同的帖子
  const wxContext = cloud.getWXContext()
  return await db.collection("test1").where({
    user_id:wxContext.OPENID
}).get({
  success:res=>{
    console.log("查询数据库成功",res)
  },
  fail:res=>{
    console.log("查询数据库失败",res)
  }
})
}