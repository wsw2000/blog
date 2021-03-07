import {useState,useEffect} from 'react'
import './index.less'
import axios from 'axios'
import {Spin,Skeleton,Divider} from 'antd'
import Iazyimg from '../lazyImg'
import apis from '../../utils/request'
import {timefilter} from '../../utils'
const Sentence = () =>{
  const [newslist,setNewslist] = useState([])
  useEffect(async() => {
    const {data:res} =await apis.getDateMsg(timefilter(Date.now(),'ymd'))
    if(res.data.data.errno == 0 && res.data.data.errmsg == "success"){
      setNewslist(res.data.data)
    }else{
      const arr = {note:'每日一句接口炸啦！'}
      setNewslist(arr)
    }
  },[])
  return (
    <div className="Senbox">
      <Divider>每日一句</Divider>
      <div className="Senbox-img">
        <Iazyimg src={newslist.picture}/>
      </div>
      <div className="Senbox-title">{newslist.content}</div>
      <div className="Senbox-title">{newslist.note}</div>
    </div>
  )
}
export default Sentence