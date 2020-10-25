// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    modalShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment: function () {
      // 判断用户是否授权
      console.log('点击了')
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {  //用户未授权
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow:true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    // 授权成功  显示评论框  隐藏授权框
    onloginSuccess(){
      this.setData({
        loginShow:false,
      },()=>{
        this.setData({
          modalShow:true
        })
      })
    },
    // 授权失败
    onloginfail(){
      wx.showModal({
        title:'授权用户才能进行评价',
        content:''
      })
    }
  }
})
