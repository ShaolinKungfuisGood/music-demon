// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blog:Object
    },
    observers:{
        ['blog.createTime'](val){
            if(val){
                this.setData({
                    createTime:formatTime(new Date(val))
                })
              
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        createTime:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onPreviewImage:function(event){
            const ds=event.currentTarget.dataset
            wx.previewImage({
              urls: ds.imgs,
              current:ds.imgsrc
            })
        }
    }
})
