// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const axios = require('axios')
// const URL = 'https://misicapi.xiecheng.live/personalized'
const URL = 'https://apis.imooc.com/personalized?icode=61D3E8EF96E6FD15'
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const countResult=await playlistCollection.count()
  const {total}=countResult
  const batchTimes=Math.ceil(total/MAX_LIMIT)
  const takes=[]
  for(i=0;i<batchTimes;i++){
   let promise= playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
   takes.push(promise)
  }
  let list={
    data:[] 
  }
  if(takes.length>0){
   list=(await Promise.all(takes)).reduce((acc,cur)=>{
      return {
        data:acc.data.concat(cur.data)
      }
    })
  }
  const {data} = await axios.get(URL)
  const playlist = data.result
  const newDate = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break;
      }
    }
    if (flag) {
      let pl = playlist[i]
      pl.createTime = db.serverDate()
      newDate.push(pl)
    }
  }
  if (data.code >= 1000) {
    return 0
  }
  if (newDate.length < 0) {
    return
  }

  await playlistCollection.add({
    data: [...newDate]
  }).then((res) => {
    console.log('插入成功')
  }).catch((err) => {
    console.log('插入失败')
  })
  return newDate.length
}