// pages/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
let nowPlayingIndex=0
let musiclist=[]
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
        nowPlayingIndex = options.index
        console.log(options.musicId)
        this.getMusicMsg(options.musicId)
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
    getMusicMsg: function (musicId) {
        backgroundAudioManager.stop()
        musiclist = wx.getStorageSync('musiclist')
        let music = musiclist[nowPlayingIndex]
        wx.setNavigationBarTitle({
            title: music.name
        })
        this.setData({
            picUrl: music.al.picUrl,
            isPlaying:false
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
            backgroundAudioManager.src=result.data[0].url
            backgroundAudioManager.title=music.name
            this.setData({
                isPlaying:true
            })
        })
    },
    onPev:function(){
        nowPlayingIndex--
        if(nowPlayingIndex<0){
            nowPlayingIndex=musiclist.length-1
        }
        this.getMusicMsg(musiclist[nowPlayingIndex].id)
    },
    onNext:function(){
        nowPlayingIndex++
        if(nowPlayingIndex===musiclist.length){
            nowPlayingIndex=0
        }
        this.getMusicMsg(musiclist[nowPlayingIndex].id)
    },
    togglePlaying:function(){
        if(this.data.isPlaying){
            backgroundAudioManager.pause()
        }else{
            backgroundAudioManager.play()
        }
        this.setData({
            isPlaying:!this.data.isPlaying
        })
    }
})