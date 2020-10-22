// components/search/search.js
let keyWord='' //搜索内容
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder:String
    },
    externalClasses:[
        'iconfont',
        'icon-sousuo'
    ],
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onInput(event){
            keyWord=event.detail.value
        },
        onSearch(){
            this.triggerEvent('search', {keyWord})
        }
    }
})
