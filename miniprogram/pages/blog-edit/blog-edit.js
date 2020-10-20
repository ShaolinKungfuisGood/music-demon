// pages/blog-edit/blog-edit.js
const Max_WORDS_NUM = 140  //文字输入的最大个数
const Max_IMG_COUNT = 9 //最大图片上传数量
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
        console.log(options)
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 点击删除图片
    onDellImg(e) {
        let { index } = e.currentTarget.dataset
        this.data.images.splice(index, 1)
        this.setData({
            images:this.data.images
        })
        if(this.data.images.length==Max_IMG_COUNT-1){
            this.setData({
                selectPhoto:true
            })
        }
    },
    onPreViewImg(e){
        wx.previewImage({
          urls: this.data.images,
          current:e.currentTarget.dataset.imgSrc
        })
    },
    // 用户输入文字
    onInput(e) {
        console.log(e)
        let wordsNum = e.detail.cursor
        console.log(wordsNum)
        if (wordsNum >= Max_WORDS_NUM) { //最大字数检测
            wordsNum = `最大字数为${Max_WORDS_NUM}`
        }
        this.setData({
            wordsNum
        })
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
    }


})