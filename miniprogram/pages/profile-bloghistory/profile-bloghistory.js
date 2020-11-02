// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LILMIT=10
const blogCollection=wx.cloud.database().collection('blog')
import formatTime from '../../utils/formatTime.js'
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBlogListHistory() //云函数调用
        // this.getBlogListByminPro() //小程序调用
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getBlogListHistory()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (event) {
        const blog=event.target.dataset.blog
        return{
            title:blog.content, 
            path:`/pages/blog-comment/blog-comment?blogId=${blog._id}`,
            imageUrl:blog.img[0]
        }
    },
    // 调用云函数
    //方法1
    getBlogListHistory:function(){
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'blog',
            data:{
                $url:'getListByOrder',
                start:this.data.blogList.length,
                count:MAX_LILMIT
            }
        }).then((res)=>{
            let bloglist=res.result
            for(let i=0,len=bloglist.length;i<len;i++){
                // bloglist[i].createTime=bloglist[i].toString()
                bloglist[i].createTime = formatTime(new Date(bloglist[i].createTime))
            }
            this.setData({
                blogList:this.data.blogList.concat(bloglist)
                
            })  
        
            wx.hideLoading()
        })
    },
    // 在小程序端调用云数据库
    // 方法2
    // getBlogListByminPro:function(){
    //     blogCollection
    //     .skip(this.data.blogList.length)
    //     .limit(MAX_LILMIT)
    //     .orderBy('createTime', 'desc')
    //     .get()
    //     .then((res)=>{
    //         let bloglist=res.data
    //         for(let i=0,len=bloglist.length;i<len;i++){
    //             // bloglist[i].createTime=bloglist[i].toString()
    //             blogList[i].createTime = formatTime(new Date(blogList[i].createTime))
    //         }
    //         this.setData({
    //             blogList:this.data.blogList.concat(bloglist)
                
    //         })  
    //         wx.hideLoading()
    //     })
    // },
    // 跳转到详情页面
    goComment:function(e){
        wx.navigateTo({
          url: `../blog-comment/blog-comment?blogId=${e.target.dataset.blogid}`,
        })
    }
})