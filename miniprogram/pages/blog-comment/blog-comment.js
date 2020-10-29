// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogId:{},
        blog:{},
        commentList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.getBlogDetail(options.blogId)
    },
    // 用户点击分享
    onShareAppMessage: function () {
        let blogObj=this.data.blog
        return {
          title:blogObj.content,
          path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
          imageUrl:blogObj.img[0]
        }
      },
    getBlogDetail:function(blogId){
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        wx.cloud.callFunction({
            name:'blog',
            data:{
                $url:'detail',
                blogId
            }
        }).then((res)=>{
            let commentList=res.result.commentList.data
            let blog=res.result.detail[0]
            for(let i=0,len=commentList.length;i<len;i++){ //时间格式化
                commentList[i].createTime=formatTime(new Date(commentList[i].createTime))
            }
            blog.createTime=formatTime(new Date(blog.createTime)) //时间格式化
            this.setData({
                blog:blog,
                commentList:commentList
            })
            wx.hideLoading()
        })
    }
})