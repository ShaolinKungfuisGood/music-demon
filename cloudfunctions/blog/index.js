// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')
// 云函数入口函数
exports.main = async (event, context) => {
    // await blogCollection.skip(0).limit(10).orderBy('createTime','desc').get().then((res)=>{
    //     console.log('haha',res.data)
    // })
    const app = new TcbRouter({ event })
    app.router('list', async (ctx, next) => {  
    //    ctx.body= await blogCollection.skip(event.start).limit(event.count).orderBy('createTime','desc').get().then((res)=>{
    //         return res.data
    //     })
  console.log('吓死的哈好看卡得')
        // ctx.body= await blogCollection.skip(0).limit(10).orderBy('createTime','desc').get().then((res)=>{
        //     return res.data
        // })
    })
    
}