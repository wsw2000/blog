import Head from 'next/head'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Router  from 'next/router';
import Header from '../components/Header'
import Author from '../components/Author'
import Sentence from '../components/sentence';
import Footer from '../components/Footer'
import ArticleList from '../components/ArticleList';
import api from '../utils/request';
import { Row, Col, List, Icon,Tag } from 'antd'
import marked from 'marked'
import hljs from "highlight.js";
import {timefilter} from '../utils';
import 'highlight.js/styles/monokai-sublime.css';
import {connect} from 'react-redux';

const Home = ({mylist,defaultState}) => {
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

  // const [mylist,setMyList] = useState(list.data)
  const [headTitle, setHeadTitle] = useState('吴绍温个人博客 | 前端学习笔记')

  Router.events.on('routeChangeStart',(...args)=>{
    if(args[0] == "/index") return
  })
  const checkTitle = () =>{
    document.addEventListener('visibilitychange',function(){
      var isHidden = document.hidden;
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('吴绍温个人博客 | 前端学习笔记')
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
        <link rel="icon" href="../static/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header/>
      <Row className="comm-main" type="flex" justify="center">
        <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
          <ArticleList typeId={0}  mylist={mylist}/>
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

Home.getInitialProps = async(context) => {
  const params = {
    typeId: 0,
    page:1,
    limit:5,
    orderType:'Time',
    order:'DESC'
  }

  const { data: res } = await api.getArticleList(params)
  if(res.code != 1) return
  res.data.forEach(item => {
    item.addTime = timefilter(item.addTime,'ymd')
  })
  return { mylist:res.data}
}
export default connect(
  state => ({
    defaultState: state,
  }),
  {}
)(Home)