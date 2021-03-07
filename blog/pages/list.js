import Head from 'next/head'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router';
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import Sentence from '../components/sentence';
import {timefilter} from '../utils';
import api from '../utils/request';
import Iazyimg from '../components/lazyImg';
import { Row, Col, List, Icon, Breadcrumb,Tag } from 'antd'
import {connect} from 'react-redux';
import LazyLoad from 'react-lazyload';
const myList = ({result,defaultState}) => {
  const [types, setTypes] = useState(['技术','生活'])
  const [list, setList] = useState(result.res.data)
  useEffect(()=>{
    setList(result.res.data)
  })   
  const [headTitle, setHeadTitle] = useState('博客列表 | 吴绍温个人博客 | 前端学习笔记')
  const checkTitle = () =>{
    document.addEventListener('visibilitychange',function(){
      var isHidden = document.hidden;
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('博客列表 | 吴绍温个人博客 | 前端学习笔记')
    })
  }
  useEffect(() => { 
    checkTitle()
    // 在此可以执行任何带副作用操作
    return () => { 
      checkTitle()
      // 在组件卸载前执行
      // 在此做一些收尾工作, 比如清除定时器/取消订阅等
    }
  },[]) 
  return (
    <div className={["next-box",defaultState.visible ? 'next-right' : ''].join(' ')}>
       <Head>
        <title>{headTitle}</title>
      </Head>
      <Header />
      <Row className="comm-main" type="flex" justify="center">
        <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
           <div className="bread-div">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href="/">首页</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {types[result.type - 1] || result.res.data[0].typeName}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <List
              header={<div className="listTitle">博客列表</div>}
              footer={<div></div>}
              itemLayout="vertical"
              dataSource={list}   // 数据源
              renderItem={item => (
                <LazyLoad height={200} offset={-200} >
                  <List.Item className="listItem"
                  onClick={()=>Router.push(`/detailed?id=${item.id}`)}>
                    <div className="listItem-img">
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
        </Col>
        <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Sentence/>
        </Col>
      </Row>
        <Footer></Footer>
    </div>
  )
}

myList.getInitialProps = async(context) =>{
  const {data:res} = await api.getListByType(context.query.id)
  res.data.forEach(item => {
    item.addTime = timefilter(item.addTime,'ymd')
  });
  const result = { res,type:context.query.id }
  return {result}
}
export default connect(
  state => ({
    defaultState: state,
  }),
  {}
)(myList)