import Head from 'next/head'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router';
import Header from '../components/Header'
import Author from '../components/Author'
import Sentence from '../components/sentence';
import Footer from '../components/Footer'
import LazyLoad from 'react-lazyload';
import api from '../utils/request';
import {timefilter} from '../utils';
import { Row, Col, List, Icon,Tag } from 'antd'
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import Iazyimg from '../components/lazyImg';
import {connect} from 'react-redux';

const Home = ({list,defaultState}) => {

  //markdown 解析配置
  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    sanitize:false,
    xhtml: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  }); 

  const [mylist,setMyList] = useState(list.data)
  const [headTitle, setHeadTitle] = useState('首页 | 吴朝温 | 前端学习笔记 | 吴绍温个人博客')

  Router.events.on('routeChangeStart',(...args)=>{
    if(args[0] == "/index") return
  })
  const checkTitle = () =>{
    document.addEventListener('visibilitychange',function(){
      var isHidden = document.hidden;
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('首页 | 吴朝温 | 前端学习笔记 | 吴绍温个人博客')
    })
  }
  useEffect(() => { 
    checkTitle()
    // 在此可以执行任何带副作用操作
    return () => { 
      checkTitle()
      setMyList([])
      // 在组件卸载前执行
      // 在此做一些收尾工作, 比如清除定时器/取消订阅等
    }
  },[]) 
  return (
    <div className={["next-box",defaultState.visible ? 'next-right' : ''].join(' ')}>
      <Head>
        <title>{headTitle}</title>
        <link rel="icon" href="../static/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Row className="comm-main" type="flex" justify="center">
        <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
          <List
            header={<div className="listTitle">             
              博客列表</div>}
            footer={<div></div>}
            itemLayout="vertical"
            dataSource={mylist}   // 数据源
            renderItem={item => (
              <LazyLoad height={200} offset={-200} >
                <List.Item 
                  className="listItem cssnice"
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
        <Col className="comm-right cssniceright" xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Sentence/>
        </Col>
      </Row>
      <Footer demo={5}/>
    </div>
  )
}

Home.getInitialProps = async () => {
  const { data: res } = await api.getArticleList()
  res.data.forEach(item => {
    item.addTime = timefilter(item.addTime,'ymd')
  });
  return {list:res}
}


export default connect(
  state => ({
    defaultState: state,
  }),
  {}
)(Home)