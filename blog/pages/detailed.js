import React,{useState,useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { Row, Col, Icon, Breadcrumb,Affix } from 'antd'
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer' 
import '../styles/detail.less'

import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import Tocify from '../utils/tocify.tsx';
import api from '../utils/request';
const Detailed = (list) => {
   useEffect(()=>{
    postVisits()
    return ()=>{
      
    }
  },[])
  const postVisits = async() =>{
    const result = await api.postVisits({id:list.id})
  }
  let articleContent = list.content
  const tocify = new Tocify()
  let renderer = new marked.Renderer()
  //重新定义对#这种标签的解析
  renderer.heading = function(text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
  };
  
  marked.setOptions({
    renderer:renderer,
    gfm: true,   //启动类似Github样式的Markdown
    pedantic: false, // 只解析符合Markdown定义的，不修正Markdown的错误
    sanitize: false, //原始输出，忽略HTML标签，这个作为一个开发人员，一定要写flase
    tables: true, // 支持Github形式的表格，必须打开gfm选项
    breaks: false, //支持Github换行符，必须打开gfm选项，填写true或者false
    smartLists: true, //优化列表输出，这个填写ture之后，你的样式会好看很多，所以建议设置成ture
    smartypants: false,
    highlight: function (code) {  // 高亮显示规则
      return hljs.highlightAuto(code).value;
    }
  });
  let html = marked(articleContent) 
  return (
    <>
    <Head>
      <title>Detailed</title>
    </Head>
    <Header />
    <Row className="comm-main" type="flex" justify="center">
      <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}  >
        <div>
          <div className="bread-div">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href={{pathname:'/index'}}>
                  <a>首页</a>
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{list.typeName}</Breadcrumb.Item>
              <Breadcrumb.Item>{list.title}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <div className="detailed-title">
              {list.title}
            </div>
            <div className="list-icon center">
              <span><Icon type="calendar" /> {list.addTime}</span>
              <span><Icon type="folder" /> {list.typeName}</span>
              <span><Icon type="fire" /> {list.view_count || 0}</span>
            </div>
            <div className="detailed-content" 
            dangerouslySetInnerHTML = {{__html:html}} />
            <div className="detailed-comments">
              <div className='detailed-comments-title'>
                评论列表
              </div>
              {
                list.comments_list.map(item =>{
                  return (
                    <div className="commentsItem" key={item.id}>
                      <div className="comments-item">
                        <div className="icon"></div>
                        <div className="contaner">
                          <div className="unamed">
                            <div className="name">{item.unamed}</div>
                          </div>
                          <div className="time">
                            <div>{item.address}</div>
                            <div>{item.addTime}</div>
                          </div>
                          <div className="content">{item.content}</div>
                        </div>
                      </div>       
                      {
                        item.replyLists.map(item1 => {
                          return (
                            <div className="comments-item reply" key={item1.id}>
                              <div className="icon"></div>
                              <div className="contaner">
                                <div className="unamed">
                                  <div className="name">{item1.unamed}</div>
                                  {
                                    item1.to_unamed &&
                                    <>
                                      <div>回复</div>
                                      <div className="name">{item1.to_unamed}</div>
                                    </>
                                    
                                  }
                                </div>
                                <div className="time">
                                  <div>{item1.address}</div>
                                  <div>{item1.addTime}</div>
                                </div>
                                <div className="content">{item1.content}</div>
                              </div>
                            </div>    
                          )
                        })
                      }           
                    </div> 
                  )
                })
              }  
            </div>
          </div>
        </div>
      </Col>
      <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
        <Author />
        <Affix offsetTop={10}>
            <div className='detailed-nav common-right-box'>
              <div className='nav-title'>文章目录</div>
              <div className="toc-list">
                {tocify && tocify.render()}
              </div>
            </div>
          </Affix>
      </Col>
    </Row>
    <Footer />
  </>
  )
}
function timefilter(value) {
  let time = new Date(value)
  let year = time.getFullYear()
  let month = (time.getMonth() + 1 + '').padStart(2, '0')
  let date = (time.getDate() + '').padStart(2, '0')

  return `${year}-${month}-${date} `
}
Detailed.getInitialProps = async(context)=>{
  let id =context.query.id
  const promise = new Promise((resolve,reject)=>{
    api.getActicleById(id).then(
      (res)=>{
        res.data.data[0].addTime = timefilter(res.data.data[0].addTime)
        resolve(res.data.data[0])
      }
    ).catch(e =>{
      reject(e)
    })
  })

  return await promise
}
export default Detailed