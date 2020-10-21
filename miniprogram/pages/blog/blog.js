// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow:false, //控制底部弹出层
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList() //获取博客列表信息
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
  },
  getBlogList(){
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'list',
        start:0,
        count:10,
      }
    }).then((res)=>{
      console.log(res)
     this.setData({
       blogList:this.data.blogList.concat(res.result)
     })
    }).catch((err)=>{
      console.log(err)
    })
  }
})