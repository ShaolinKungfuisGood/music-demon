// pages/blog/blog.js
import formatTime from '../../utils/formatTime.js'
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow: false, //控制底部弹出层
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList(0) //获取博客列表信息
  },

  onShow: function () {},
  //上拉加载
  onReachBottom() {
    this.getBlogList(this.data.blogList.length)
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      blogList: []
    })
    this.getBlogList(0)
  },
  //用户点击右上角分享
  onShareAppMessage: function (e) {

    let blogObj=e.target.dataset.blog
    console.log(blogObj.img[0])
    return {
      title:blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      imageUrl:blogObj.img[0]
    }
  },
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              this.onloginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalshow: true
          })
        }
      }
    })
  },
  onloginSuccess(e) {
    const {
      detail
    } = e

    wx.navigateTo({
      url: `../blog-edit/blog-edit?nikeName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onloginfail(e) {
    wx.showModal({
      title: '授权用户才能发布',
      content: ''
    })
  },
  getBlogList(start = 0) { //设置start默认值
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        start,
        count: 10,
        keyword
      }
    }).then((res) => {
      let blogList = res.result
      for (let i = 0, len = blogList.length; i < len; i++) { //时间格式化
        blogList[i].createTime = formatTime(new Date(blogList[i].createTime))
      }
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      //  console.log(this.data.blogList)
      wx.hideLoading()
    }).catch((err) => {
      console.log(err)
    })
  },
  // 跳转到详情页面
  navtoComment(event) {
    const blogId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../blog-comment/blog-comment?blogId=' + blogId,
    })
  },
  // 用户点击查询按钮
  onSearch: function (event) {
    keyword = event.detail.keyWord
    this.setData({
      blogList: []
    })
    this.getBlogList(0)
  }
})