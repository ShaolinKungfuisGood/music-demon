// pages/blog-edit/blog-edit.js
const Max_WORDS_NUM = 140 //文字输入的最大个数
const Max_IMG_COUNT = 9 //最大图片上传数量
const db=wx.cloud.database()
let content=''
let userInfo={}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordsNum: 0,
        footerBottom: 0,
        images: [],
        selectPhoto: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        userInfo=options
    },
    onChooseImage: function () {
        // 表示还能选多少张图片
        let max = Max_IMG_COUNT - this.data.images.length
        wx.chooseImage({
            count: max,
            sizeType: ['original', 'compressed'],
            sizeType: ['album', 'camera'],
            success: (res) => {
                this.setData({
                    images: this.data.images.concat(res.tempFilePaths)
                })
                max = Max_IMG_COUNT - this.data.images.length
                this.setData({
                    selectPhoto: max <= 0 ? false : true
                })
            }
        })
    },
    // 点击发布
    send() {
        //图片上传

        if(content.trim()===''){
            wx.showToast({
              title: '内容不能为空',
              icon:'none'
            })
            return
        }
        let promiseArr = []
        let fileIds=[]
        wx.showLoading({
          title: '发布中',
          mask:true
        })
        for (let i = 0, len = this.data.images.length; i < len; i++) {
         let p= new Promise((resolve, reject) => {
                let item = this.data.images[i]
                let suffix = /\.\w+$/.exec(item)[0]
                wx.cloud.uploadFile({
                    cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
                    filePath: item,
                    success: (res) => {
                        fileIds= fileIds.concat(res.fileID)
                       resolve()
                    },
                    fail: (err) => {
                        reject
                    }
                })
            })
            promiseArr.push(p)
        }
        // 存入到云数据库当中
        Promise.all(promiseArr).then((res)=>{
            db.collection('blog').add({  //插入数据库是自带openID的
                data:{
                    ...userInfo,
                    content:content,
                    img:fileIds,
                    createTime:db.serverDate() //服务端时间
                }
            }).then((res)=>{
                wx.hideLoading()
                wx.showToast({
                  title: '发布成功',
                })
                // 返回上一页
                wx.navigateBack()
                const pages = getCurrentPages()
                // console.log(pages)
                // 取到上一个页面
                const prevPage = pages[pages.length - 2]
                prevPage.onPullDownRefresh()
            }).catch((res)=>{
                wx.hideLoading()
                wx.showToast({
                  title: '发布失败',
                })
            })
        })
    },  
    // 点击删除图片
    onDellImg(e) {
        let {
            index
        } = e.currentTarget.dataset
        this.data.images.splice(index, 1)
        this.setData({
            images: this.data.images
        })
        if (this.data.images.length == Max_IMG_COUNT - 1) {
            this.setData({
                selectPhoto: true
            })
        }
    },
    onPreViewImg(e) {
        wx.previewImage({
            urls: this.data.images,
            current: e.currentTarget.dataset.imgSrc
        })
    },
    // 用户输入文字
    onInput(e) {
        let wordsNum = e.detail.cursor
        if (wordsNum >= Max_WORDS_NUM) { //最大字数检测
            wordsNum = `最大字数为${Max_WORDS_NUM}`
        }
        this.setData({
            wordsNum
        })
        content=e.detail.value
    },
    //用户获取焦点
    onFocus(e) {
        this.setData({
            footerBottom: e.detail.height
        })
    },
    //用户离开焦点
    onBlur(e) {
        this.setData({
            footerBottom: 0
        })
    },



})