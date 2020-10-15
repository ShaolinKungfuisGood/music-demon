// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicList(options.playlistId)
  },
  
  //获取播放列表
  getMusicList:function(playlistId){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musiclist',
        playlistId:playlistId
      }
    }).then((res)=>{
      let  p1=res.result.playlist
      this.setData({
        musiclist:p1.tracks,
        listInfo:{
          coverImgUrl:p1.coverImgUrl,
          name:p1.name
        }
      })
     wx.hideLoading()
      this.setMusicList()
    })
  },
  setMusicList:function(){
    wx.setStorageSync('musiclist', this.data.musiclist)
  }
})