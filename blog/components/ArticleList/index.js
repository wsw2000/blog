import {useEffect,useState} from 'react';
import Link from 'next/link'
import Router from 'next/router';
import { List,Icon,Tag,Spin,Button,Divider,Radio } from 'antd';
import Iazyimg from '../lazyImg';
import LazyLoad from 'react-lazyload';
import {timefilter} from '../../utils';
import apis from '../../utils/request';
import useFetchState from '../../utils/useFetchState';
const ArticleList = (props) => {
  const [mylist,setMylist] = useState(props.mylist)
  const [btnLoading,setBtnLoading] = useFetchState(false)
  const [isEnd,setIsEnd] = useFetchState(false)
  const [listLoading,setListLoading] = useFetchState(false)

  const [page,setPage] = useFetchState(1)
  const [limit,setLimit] = useFetchState(5)
  const [orderType,setOrderType] = useFetchState('Time')
  const [order,setOrder] = useFetchState('DESC')
  
  // useEffect(async()=>{
  //   const params = {
  //     typeId: props.typeId,
  //     page:1,
  //     limit,
  //     orderType,
  //     order
  //   }
  //   if(props.mylist && props.mylist.length != 0){
  //     console.warn('==');
  //   }else{
  //     console.warn('--');
  //     const result = await getArticleList(params)
  //     setMylist(result)
  //   }
  // },[])
  const getArticleList = async(params) =>{
    setListLoading(true)
    const { data: res } = await apis.getArticleList(params)
    if(res.code != 1) return
    setListLoading(false)
    setIsEnd(res.end)
    res.data.forEach(item => {
      item.addTime = timefilter(item.addTime,'ymd')
    });
    return (res.data)
  }

  //加載下一頁
  const pushArticleList = () => {
    setBtnLoading(true)
    setTimeout(() => {
      const params = {
        typeId: props.typeId,
        page:page + 1,
        limit,
        orderType,
        order
      }
      apis.getArticleList(params).then(res => {
        if(res.data.code != 1) return
        res.data.data.forEach(item => {
          item.addTime = timefilter(item.addTime,'ymd')
        });
        const newList = [...mylist, ...res.data.data]
        setMylist(newList)
        setPage(page => page + 1)
        setBtnLoading(false)
        setIsEnd(res.data.end)
      })
    }, 500)
  }
  //时间还是浏览数
  const changeListOrder =async (value) => {
    setOrderType(value)
    setPage(1)
    const params = {
      typeId: props.typeId,
      page:1,    //切换  时间浏览排序保留page
      limit,
      orderType : value,
      order
    }
    const result = await getArticleList(params)
    setMylist(result)
  }
  return (
    <>
      <Spin spinning={listLoading}>
        <List
          header={
            <div className="listTitle">             
              <div>博客日志</div>
              <div className='order-type'>
                <Radio.Group value={orderType} buttonStyle="solid" onChange={(e)=>{changeListOrder(e.target.value)}}>
                  <Radio.Button value="Time">最新 </Radio.Button>
                  <Radio.Button value="Count">热门</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          }
          footer={<div></div>}
          itemLayout="vertical"
          dataSource={mylist}   // 数据源
          renderItem={item => (
            <LazyLoad height={200} offset={150} >
              <List.Item 
                className="listItem cssnice"
                >
                  <div className="listItem-img" onClick={()=>Router.push(`/detailed?id=${item.id}`)}>
                    <Iazyimg src={item.imgUrl || 'https://tva2.sinaimg.cn/large/9bd9b167ly1fwsflokx5rj21hc0u07w2.jpg'}></Iazyimg>
                  </div>
                  <div className="listItem-content">
                    <div className="listItem-content-title">
                      <Tag color="geekblue">{item.typeName}</Tag>
                      <Link href={{pathname:'/detailed',query:{id:item.id}}}>
                        <a>{item.title}</a>
                      </Link> 
                    </div>
                    <div className="listItem-content-introduce">
                      <span>{item.introduce}</span>
                    </div>
                    <div className="listItem-content-footer">
                      <div>
                        <Icon type="fire" /><span>{item.view_count || 0}</span>
                      </div>
                      <div>
                        <Icon type="calendar" /><span>{item.addTime}</span>
                      </div>
                    </div>
                  </div>
              </List.Item>
            </LazyLoad>
          )}
        />
        <LazyLoad height={200} offset={150} >
          {
            isEnd ? <Divider style={{color:'#1890ff'}}>没有更多了....</Divider> 
            : <Button type="primary" onClick={pushArticleList} loading={btnLoading} 
                style={{margin:'0 auto',display:'block'}}>
                加载更多日志
              </Button>
          }
        </LazyLoad>
       
      </Spin>  
    </>
  )
}

export default ArticleList