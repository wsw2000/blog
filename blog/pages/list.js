import Head from 'next/head'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import api from '../utils/request';
import Iazyimg from '../components/lazyImg';
import { Row, Col, List, Icon, Breadcrumb,Tag } from 'antd'

const myList = (result) => {
  const [types, setTypes] = useState(['技术','生活'])
  const [list, setList] = useState(result.res.data)
  useEffect(()=>{
    setList(result.res.data)
  })   
  //传入一个参数，代表着componentDidMount componentDidUpadte
  // [],相当于componentDidMount   [list]  list改变才监测 

  return (
    <div className="next-box">
      <Head>
        <title>wsw</title>
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
              <List.Item className="listItem">
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
              )}
            />
        </Col>
        <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
        </Col>
      </Row>
        <Footer></Footer>
    </div>
  )
}
function timefilter(value) {
  let time = new Date(value)
  let year = time.getFullYear()
  let month = (time.getMonth() + 1 + '').padStart(2, '0')
  let date = (time.getDate() + '').padStart(2, '0')

  return `${year}-${month}-${date}`
}
myList.getInitialProps = async(context) =>{
  const {data:res} = await api.getListByType(context.query.id)
  res.data.forEach(item => {
    item.addTime = timefilter(item.addTime)
  });
  const result = { res,type:context.query.id }
  return result
}
export default myList