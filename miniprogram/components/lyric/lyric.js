// components/lyric/lyric.js
let lyrichight=0 //当前歌词高度
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isLyricShow:{  //控制组件的显示与隐藏
            type:Boolean,
            value:false
        },
        lyric:String  //歌词信息
    },
    // 监听器
    observers:{
        lyric(lrc){
            if(lrc==='暂无歌词'){ //纯音乐
                this.setData({
                    lrclist:[{
                        lrc,
                        time:0
                    }],
                    nowLyricIndex:-1
                })
                return
            }
            this.parseLyric(lrc) //将歌词信息进行解析
        }   
    },
    /**
     * 组件的初始数据   
     */
    data: {
        nowLyricIndex:0, //当前选中歌词的索引
        scrollTop:0 //滚动条滚动的高度
    },
    lifetimes:{
        ready(){
            //px和rpx进行换算
            wx.getSystemInfo({  //不同手机的宽高兼容
              success: (res) => {
                //求出1rpx大小
                lyrichight=  res.screenWidth/750*64
              },
            })
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        update(currentTime){ //歌词与时间联动
          let {lrclist}=this.data //从页面缓存中  获取歌词列表
          if(lrclist.length===0){  
              return
          }
          if(currentTime>lrclist[lrclist.length-1].time){ //当前的播放时间大于歌词信息中的时间
              if(this.data.nowLyricIndex!=-1){
                  this.setData({
                    nowLyricIndex:-1,  //歌词索引设置为首位
                    scrollTop:lrclist.length*lyrichight //设置竖向滚动条位置
                  })
              }  
          }
          for(let i=0,len=lrclist.length;i<len;i++){  
            if(currentTime <= lrclist[i].time){ //当前播放时间小于歌词信息中的时间
                this.setData({
                    nowLyricIndex:i-1, 
                    scrollTop:(i-1)*lyrichight//高亮位于滑动中间
                })
                break
            }
          }
        },
        //歌词解析
        parseLyric(sLyric){
            let line=sLyric.split('\n')  //按照换行符，将歌词和时间分别组成数组
            let lrclist=[]  //歌词列表
            line.forEach((elemt)=>{
                let time=elemt.match(/\[\d{2,}:(\d{2})(?:\.(\d{2,3}))?]/g)  //将歌词时间按照正则表达式进行匹配
                if(time!=null){
                    let lrc=elemt.split(time)[1]  //获取匹配后的歌曲内容
                    let timeReg=time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
                    //把时间转化为对应的秒
                    let time2Seconds=parseInt(timeReg[1])*60+parseInt(timeReg[2])+parseInt(timeReg[3])/1000
                    lrclist.push({
                        lrc,
                        time:time2Seconds,
                    })
                }
            })
            this.setData({
                lrclist
            })
            // console.log(this.data.lrclist)
        },
      
    }
})