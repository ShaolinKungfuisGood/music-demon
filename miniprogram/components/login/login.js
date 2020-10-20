// components/login/login.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        modalshow:Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onGetUserInfo:function(event){
            console.log(event)
            const {userInfo}=event.detail
            // 允许授权
            if(userInfo){
                this.setData({
                    modalshow:false
                })
                this.triggerEvent('loginSuccess',userInfo)
            }else{
                this.triggerEvent('loginfail',userInfo)
            }
        }
    }
})
