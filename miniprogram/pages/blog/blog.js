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
    this.getBlogList(0) //获取博客列表信息
  },
 
  onShow:function(){
  },
  //上拉加载
  onReachBottom(){
    this.getBlogList(this.data.blogList.length)
  },
  // 下拉刷新
  onPullDownRefresh(){
    this.setData({
      blogList:[]
    })
    this.getBlogList(0)
  },
  onPublish(){
    // 判断用户是否授权
    wx.getSetting({
      success:(res)=>{
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
  getBlogList(start=0){ //设置start默认值
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'list',
        start,
        count:10,
      }
    }).then((res)=>{
     this.setData({ 
       blogList:this.data.blogList.concat(res.result)
     })
     wx.hideLoading()
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 跳转到详情页面
  navtoComment(event){
    const blogId=event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../blog-comment/blog-comment?blogId='+blogId,
    })
  }
})