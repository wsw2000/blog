import {useState,useEffect} from 'react'
import './index.less'
import axios from 'axios'
import {Spin,Skeleton} from 'antd'
import Iazyimg from '../lazyImg'
const Sentence = () =>{
  const [newslist,setNewslist] = useState([])
  useEffect(async() => {
    const {data:res} =await axios.get(`http://api.tianapi.com/txapi/everyday/index`,{
      params:{
        key:'07fe42a4d7cfb1444686d6be626b80f2'
      }
    })
    if(res.code == 200){
      setNewslist(res.newslist[0])
    }else{
      const arr = {note:'每日一句接口炸啦！'}
      setNewslist(arr)
    }
  },[])
  return (
    <div className="Senbox">
      每日一句美好英语
      <div className="Senbox-img">
        <Iazyimg src={newslist.imgurl}/>
      </div>
      <div className="Senbox-title">{newslist.content}</div>
      <div className="Senbox-title">{newslist.note}</div>
    </div>
  )
}
export default Sentence