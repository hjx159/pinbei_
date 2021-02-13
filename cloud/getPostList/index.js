// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:"pinbei-0gwjlz0r8825e878"
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  if(event.action==="shouye"&&event.key==="全部"){
    return await db.collection("test1")/* .orderBy('publish_time','desc') */
    /* .where({
      publish_time:_.gt(event.timelimit)  //帖子发布时间晚于timelimit的才会显示
    }) */
    // .orderBy('publish_time','desc')
    .where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
      position:_.geoNear({
        geometry:db.Geo.Point(event.longitude,event.latitude),
        maxDistance:event.maxDistance
      })
    })
    // .orderBy('publish_time','desc')
    
    .skip(event.len)
    .limit(event.numOfPostsOneTime)
    .get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  }
  else if(event.action==="shouye"&&event.key!=="全部"){
    return await db.collection("test1")/* .orderBy('publish_time','desc') */
    /* .where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
    }) */
    .where({
      post_tags:_.elemMatch(_.eq(event.key)),
      publish_time:_.gt(event.timelimit), //帖子发布时间晚于timelimit的才会显示
      position:_.geoNear({
        geometry:db.Geo.Point(event.longitude,event.latitude),
        maxDistance:event.maxDistance
      })
    })
    /* .where({
      post_tags:_.elemMatch(_.eq(event.key))
    }) */
    .skip(event.len)
    .limit(event.numOfPostsOneTime)
    .get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  }
  /* if(event.action==="shouye"&&event.key==="全部"){
    return await db.collection("posts").orderBy('publish_time','desc').where({
      publish_time:_.gt(event.timelimit)  //帖子发布时间晚于timelimit的才会显示
    }).skip(event.len).limit(event.numOfPostsOneTime).get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  }
  else if(event.action==="shouye"&&event.key!=="全部"){
    return await db.collection("posts").orderBy('publish_time','desc').where({
      publish_time:_.gt(event.timelimit),  //帖子发布时间晚于timelimit的才会显示
      post_tags:_.elemMatch(_.eq(event.key))
    }).skip(event.len).limit(event.numOfPostsOneTime).get({
      success:res=>{
        console.log("查询数据库成功",res)
      },
      fail:res=>{
        console.log("查询数据库失败",res)
      }
    })
  } */
}