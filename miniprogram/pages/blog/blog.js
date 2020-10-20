// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow:false //控制底部弹出层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onPublish(){
    // 判断用户是否授权
    wx.getSetting({
      success:(res)=>{
        console.log(res)
        if(res.authSetting["scope.userInfo"]){  
          wx.getUserInfo({
            success:(res)=>{
           this.onloginSuccess({detail:res.userInfo})
            }
          })
        }else{
          this.setData({
            modalshow:true
          })
        }
      }
    })
  },
  onloginSuccess(e){
   const {detail}=e
  wx.navigateTo({
    url:`../blog-edit/blog-edit?nikeName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
  })
  },
  onloginfail(e){
   wx.showModal({
     title:'授权用户才能发布',  
     content:''
   })
  }
})