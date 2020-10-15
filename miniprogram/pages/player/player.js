// pages/player/player.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl: '',
        isPlaying:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMusicMsg(options)
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
    //获取歌曲信息
    getMusicMsg: function (e) {
        let nowPlayingIndex = e.index
        let {musicId} = e
        console.log(musicId)
        let musiclist = wx.getStorageSync('musiclist')
        let music = musiclist[nowPlayingIndex]
        wx.setNavigationBarTitle({
            title: music.name
        })
        this.setData({
            picUrl: music.al.picUrl
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'music',
            data: {
                musicId,
                $url: 'musicUrl'
            }
        }).then((res) => {
            wx.hideLoading()
            let {result}=res
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            backgroundAudioManager.src=result.data[0].url
            backgroundAudioManager.title=music.name
            this.setData({
                isPlaying:true
            })
        })
    }
})