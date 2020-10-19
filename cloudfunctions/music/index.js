// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const axios = require('axios')
const BASE_URL = 'https://apis.imooc.com'
const ICODE = '61D3E8EF96E6FD15'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({ event })
    app.router('playlist', async (ctx, next) => {
        ctx.body = await cloud.database().collection('playlist')
            .skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
            .then((res) => {
                return res
            })
    })

    app.router('musiclist', async (ctx, next) => {
        ctx.body = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}&icode=${ICODE}`).then((res) => {
            return res.data
        })
    })

    app.router('musicUrl',async(ctx,next)=>{
        ctx.body=await axios.get(`${BASE_URL}/song/url?id=${event.musicId}&icode=${ICODE}`).then((res)=>{
            return res.data
        })
    })
    app.router('lyric',async(ctx,next)=>{
        ctx.body=await axios.get(`${BASE_URL}/lyric/url?id=${event.musicId}&icode=${ICODE}`).then((res)=>{
            return res.data
        })
    })
    return app.serve()
}