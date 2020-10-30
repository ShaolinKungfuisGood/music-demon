// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const {
            OPENID
        } = cloud.getWXContext()
        // console.log(OPENID)
        // console.log(event.blogId)
        // console.log(event.content)
        // console.log(event.nickName)
        const result = await cloud.openapi.subscribeMessage.send({
            touser: OPENID,
            page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
            data: {
                thing1: {
                    value: event.content
                },
                name3: {
                    value: event.nickName
                }
            },
            miniprogramState: 'developer',
            templateId: 'FPWNnROLXa0_BeNyVLKx5qfoc4y-MtwxiXyZkmo8mbM',
        })
        return result
    } catch (err) {
        console.log(err)
    }
}