// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=6D20B0263447634A'
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const countResult=await playlistCollection.count() //获取当前数据库中的playlist集合的总条数
  const {total}=countResult
  const batchTimes=Math.ceil(total/MAX_LIMIT) //向上取整，获取循环的次数
  const takes=[]
  for(i=0;i<batchTimes;i++){
   let promise= playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()   //循环获取playlist集合的数据，一次取100条，并存入promise对象当中
   takes.push(promise) //将取出的数据放入数组中
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