// pages/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
let nowPlayingIndex = 0
let musiclist = []
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl: '',
        isPlaying: false, //控制音乐播放状态
        isLyricShow: false, //控制歌词的显示与隐藏
        isSame: false //重新点击  查看是否为同一首歌
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
        if (musicId == app.getPlayingMusicId()) {  //将当前页面与全局变量中保存的musicId进行对比 判断返回页面后重新进入是否为同一首歌曲
            this.setData({
                isSame: true  
            })
        } else {
            this.setData({
                isSame: false
            })
        }
        if (!this.data.isSame) {  //如果不是同一首歌曲，则停止播放，重新播放选择中的歌曲
            backgroundAudioManager.stop()
        }
        musiclist = wx.getStorageSync('musiclist') //从缓存中获取歌单列表信息
        let music = musiclist[nowPlayingIndex]  //获取当前索引的歌曲信息
        wx.setNavigationBarTitle({ //设置标题栏为歌曲的名称
            title: music.name
        })
        this.setData({
            picUrl: music.al.picUrl, //设置歌曲图片为页面背景
            isPlaying: false //设置默认播放状态为false
        })
        app.setPlayingMusicId(musicId) //设置当前歌曲ID到全局变量当中
        wx.showLoading({  //加载提示
            title: '加载中',
            mask: true
        })
        wx.cloud.callFunction({  //根据当前的歌曲id从云函数中获取对应歌曲信息
            name: 'music',
            data: {
                musicId,
                $url: 'musicUrl'
            }
        }).then((res) => {
            let {result} = res
            if (result.data[0].url == null) { //由于并没有登录网易云账号 vip歌曲无法播放  设置阻塞位
                wx.showToast({
                    title: '无权限播放',
                })
                return
            }
            if (!this.data.isSame) { //如果当前歌曲和上一首歌曲不相同，设置音乐实例为当前歌曲
                backgroundAudioManager.src = result.data[0].url
                backgroundAudioManager.title = music.name
            }
            this.setData({  //设置播放状态为true
                isPlaying: true
            })
            wx.hideLoading() //隐藏加载提示框
            wx.cloud.callFunction({  //从云函数中获取当前歌曲的歌词
                name: 'music',
                data: {
                    musicId,
                    $url: 'lyric'
                }
            }).then((res) => {
                let lyric = '暂无歌词'  //纯音乐的情况下  是没有歌词的 设置默认歌词
                const {
                    lrc
                } = res.result
                if (lrc) {
                    lyric = lrc.lyric
                }
                this.setData({
                    lyric
                })
            })
        })

    },
    // 播放上一首
    onPev: function () {
        nowPlayingIndex-- //当前播放歌曲的索引减1  播放上一首
        if (nowPlayingIndex < 0) { //如果当前歌曲是第一首，再度点击则播放最后一首
            nowPlayingIndex = musiclist.length - 1  
        }
        this.getMusicMsg(musiclist[nowPlayingIndex].id) //播放上一首歌曲
    },
    // 播放下一首
    onNext: function () {
        nowPlayingIndex++  //当前播放歌曲的索引加一  播放下一首
        if (nowPlayingIndex === musiclist.length) {  //如果当前歌曲是最后一首，则播放第一首
            nowPlayingIndex = 0
        }
        this.getMusicMsg(musiclist[nowPlayingIndex].id) //播放下一首歌曲
    },
    // 暂停与开始播放
    togglePlaying: function () {
        if (this.data.isPlaying) {  //根据全局变量中的播放状态来设置歌曲的暂停与播放
            backgroundAudioManager.pause()
        } else {
            backgroundAudioManager.play()
        }
        this.setData({  //重复点击取反
            isPlaying: !this.data.isPlaying
        })
    },
    // 控制歌词显示与隐藏
    onChangeLyricShow: function () {
        this.setData({
            isLyricShow: !this.data.isLyricShow
        })
    },
    // 歌词与时间联动，组件通信  page作为中间人，将progress组件中的时间传递给lyric组件
    timeUpdate: function (e) {
        this.selectComponent('.lyric').update(e.detail.currentTime)
    },
    // 控制联动暂停
    onPause: function () {
        this.setData({
            isPlaying: false
        })
    },
    // 控制联动播放
    onPlay: function () {
        this.setData({
            isPlaying: true
        })
    }
})