var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
Page({
  getUserPosition: function() {
         var _this = this;
         _this.findShop() //查询用户与商家的距离
         },
  findShop() { //拿到商家的地理位置，用到了腾讯地图的api
         // 实例化API核心类
         var _that = this
         var demo = new QQMapWX({
             key: 'UR5BZ-IIGKU-LPYVQ-4HFNJ-VSSR2-PFF6Z' // 必填
         });
         // 调用接口
         demo.calculateDistance({
            // mode:"walking",//默认即"walking"
            from:{
              latitude:26.414133,
              longitude:112.789090
            },
             to: [{
 
                 latitude: 26.428373, //商家的纬度
                 longitude: 112.856648, //商家的经度
             }],
             success: function(res) {
                 let hw = res.result.elements[0].distance //拿到距离(米)
                 if (hw && hw !== -1) { //拿到正确的值
                     //转换成公里
                     hw = (hw / 2 / 500).toFixed(2) + '公里'
                 } else {
                     hw = "距离太近或请刷新重试"
                 }
           
                 console.log('腾讯地图计算距离商家' + hw);
             }
         });
     }
 })