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
    return await db.collection("test1")
    .where({
      post_tags:_.elemMatch(_.eq(event.key)),
      publish_time:_.gt(event.timelimit), //帖子发布时间晚于timelimit的才会显示
      position:_.geoNear({
        geometry:db.Geo.Point(event.longitude,event.latitude),
        maxDistance:event.maxDistance
      })
    })
    .get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  }else{
    return await db.collection("test1")
    .where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
      position:_.geoNear({
        geometry:db.Geo.Point(event.longitude,event.latitude),
        maxDistance:event.maxDistance
      })
    })
    .get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  }
}
