import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import {
  Row,
  Col,
  Icon,
  Breadcrumb,
  Affix,
  Input,
  Avatar,
  Button,
  message,
  Modal,
  Divider,
} from 'antd'
const { TextArea } = Input
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import LazyImg from '../components/lazyImg'
import '../styles/detail.less'
import { timefilter, checkEmail } from '../utils/index'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import Tocify from '../components/tocify.tsx'
import api from '../utils/request'
import { connect } from 'react-redux'
import Comment from '../components/Comment'
import myContext from '../components/createContext.js'
const Detailed = ({ list, defaultState }) => {
  const [acticleList, setActicleList] = useState(list)
  const [replyModal, setReplyModal] = useState(false)
  const [toUnamed, setToUnamed] = useState('')
  const [isReply, setIsReply] = useState(0) //回复id 默认为0
  const [commentId, setCommentId] = useState(0) //评论id 默认为0
  const [headTitle, setHeadTitle] = useState(
    '详情页 | 吴绍温个人博客 | 前端学习笔记'
  )
  const checkTitle = () => {
    document.addEventListener('visibilitychange', function () {
      var isHidden = document.hidden
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('详情页 | 吴绍温个人博客 | 前端学习笔记')
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
  }, [])
  useEffect(() => {
    postVisits() //访问量
    return () => {
      setActicleList([])
    }
  }, [])
  //访问量
  const postVisits = async () => {
    const result = await api.postVisits({ id: acticleList.id })
  }
  //发表评论
  const publishInfo = (commentInfo) => {
    if (!commentInfo) return

    return new Promise(async (resolve, reject) => {
      const { data } = await api.publishComment(commentInfo)
      if (data.isScuccess) {
        message.success('评论成功！')
        setReplyModal(false)
        setIsReply(0) //回复成功后 回复id重置
        resolve('success') // 向子组件传值
        const data = await Detailed.getInitialProps({
          query: { id: acticleList.id },
        })
        setActicleList(data.list)
      }
    })
  }
  //回复
  const handleReply = (comment_id, toUnamed) => {
    setCommentId(0) //回复没有评论id
    setIsReply(comment_id) //回复id 就是评论的id
    setToUnamed(toUnamed || '') //如果有toUnamed则评论
    setReplyModal(true)
  }

  const handleCancel = () => {
    setReplyModal(false)
    setToUnamed('')
    setIsReply(0)
  }
  //文章详情
  let articleContent = acticleList.content
  const tocify = new Tocify()
  let renderer = new marked.Renderer()
  //重新定义对#这种标签的解析
  renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level)
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`
  }

  marked.setOptions({
    renderer: renderer,
    gfm: true, //启动类似Github样式的Markdown
    pedantic: false, // 只解析符合Markdown定义的，不修正Markdown的错误
    sanitize: false, //原始输出，忽略HTML标签，这个作为一个开发人员，一定要写flase
    tables: true, // 支持Github形式的表格，必须打开gfm选项
    breaks: false, //支持Github换行符，必须打开gfm选项，填写true或者false
    smartLists: true, //优化列表输出，这个填写ture之后，你的样式会好看很多，所以建议设置成ture
    smartypants: false,
    highlight: function (code) {
      // 高亮显示规则
      return hljs.highlightAuto(code).value
    },
  })
  let html = marked(articleContent)
  return (
    <div
      className={
        defaultState.visible && defaultState.visible ? 'next-right' : ''
      }
    >
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Header />
      <Row className='comm-main' type='flex' justify='center'>
        <Col className='comm-left' xs={24} sm={24} md={16} lg={18} xl={14}>
          <div>
            <div className='bread-div'>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link href={{ pathname: '/index' }}>
                    <a>首页</a>
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link
                    href={{
                      pathname: `/list`,
                      query: { id: acticleList.typeid },
                    }}
                  >
                    <a>{acticleList.typeName}</a>
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{acticleList.title}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <div className='detailed-title'>{acticleList.title}</div>
              <div className='list-icon center'>
                <span>
                  <Icon type='calendar' /> {acticleList.addTime}
                </span>
                <span>
                  <Icon type='folder' /> {acticleList.typeName}
                </span>
                <span>
                  <Icon type='fire' /> {acticleList.view_count || 0}
                </span>
              </div>
              <div className='detailed-content'>
                {acticleList.isShow ? (
                  <img
                    style={{ margin: '0 auto' }}
                    src={acticleList.imgUrl}
                    alt=''
                  />
                ) : null}
              </div>
              <div
                className='detailed-content'
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <div className='detailed-comments'>
                <myContext.Provider
                  value={{
                    articleId: acticleList.id,
                    comments_length: acticleList.comments_list.length,
                    toUnamed: toUnamed,
                    isReply: isReply,
                    commentId: commentId,
                  }}
                >
                  <Comment publishInfo={publishInfo}></Comment>
                </myContext.Provider>
                <div className='detailed-comments-title'>评论列表</div>
                {acticleList.comments_list.length != 0 ? (
                  acticleList.comments_list.map((item) => {
                    return (
                      <div className='commentsItem' key={item.id}>
                        <div className='comments-item'>
                          <div className='icon'>
                            <LazyImg
                              src={
                                item.iconUrl ||
                                'https://tva4.sinaimg.cn/large/9bd9b167gy1fwsgqwd0wwj21hc0u0kjl.jpg'
                              }
                              alt='icon'
                            ></LazyImg>
                          </div>
                          <div className='contaner'>
                            <div className='unamed'>
                              <div className='name'>
                                {item.email == '944627549@qq.com' ? (
                                  <div style={{ color: '#f6cda6' }}>博主</div>
                                ) : (
                                  item.unamed
                                )}
                              </div>
                              <div
                                className='replyBtn'
                                onClick={() => handleReply(item.comment_id)}
                              >
                                回复
                              </div>
                            </div>
                            <div className='time'>
                              <div>{item.address ? item.address : 'CHINA'}</div>
                              <div>{timefilter(item.addTime)}</div>
                            </div>
                            <div className='content'>{item.content}</div>
                          </div>
                        </div>
                        {item.replyLists.map((item1) => {
                          return (
                            <div className='comments-item reply' key={item1.id}>
                              <div className='icon'>
                                <LazyImg
                                  src={
                                    item1.iconUrl
                                      ? item1.iconUrl
                                      : 'https://tva4.sinaimg.cn/large/9bd9b167gy1fwsgqwd0wwj21hc0u0kjl.jpg'
                                  }
                                  alt='icon'
                                ></LazyImg>
                              </div>
                              <div className='contaner'>
                                <div className='unamed'>
                                  <div className='name'>
                                    <div className='name'>
                                      {item1.email == '944627549@qq.com' ? (
                                        <div style={{ color: '#f6cda6' }}>
                                          博主
                                        </div>
                                      ) : (
                                        item1.unamed
                                      )}
                                    </div>
                                  </div>
                                  {item1.to_unamed ? (
                                    <>
                                      <div>回复</div>
                                      <div className='name'>
                                        {item1.to_unamed}
                                      </div>
                                    </>
                                  ) : (
                                    <div
                                      className='replyBtn'
                                      onClick={() =>
                                        handleReply(
                                          item.comment_id,
                                          item1.unamed
                                        )
                                      }
                                    >
                                      回复
                                    </div>
                                  )}
                                </div>
                                <div className='time'>
                                  <div>
                                    {item1.address ? item1.address : 'CHINA'}
                                  </div>
                                  <div>{timefilter(item1.addTime)}</div>
                                </div>
                                <div className='content'>{item1.content}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                ) : (
                  <Divider style={{ color: '#1890ff', fontSize: '1.2rem' }}>
                    暂无评论
                  </Divider>
                )}
              </div>
            </div>
            <Modal
              title='回复~~'
              visible={replyModal}
              onCancel={handleCancel}
              footer={[
                <Button key='back' onClick={handleCancel}>
                  取消
                </Button>,
              ]}
            >
              <div className='detailed-comments'>
                <myContext.Provider
                  value={{
                    articleId: acticleList.id,
                    comments_length: acticleList.comments_list.length,
                    toUnamed: toUnamed,
                    isReply: isReply,
                    commentId: commentId,
                  }}
                >
                  <Comment publishInfo={publishInfo}></Comment>
                </myContext.Provider>
              </div>
            </Modal>
          </div>
        </Col>
        <Col className='comm-right' xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Affix offsetTop={10}>
            <div className='detailed-nav common-right-box'>
              <div className='nav-title'>文章目录</div>
              <div className='toc-list'>{tocify && tocify.render(60)}</div>
            </div>
          </Affix>
        </Col>
      </Row>
      <Footer />
    </div>
  )
}

Detailed.getInitialProps = async (context) => {
  let id = context.query.id
  const promise = new Promise((resolve, reject) => {
    api
      .getActicleById(id)
      .then((res) => {
        res.data.data[0].addTime = timefilter(res.data.data[0].addTime, 'ymd')
        resolve({ list: res.data.data[0] })
      })
      .catch((e) => {
        reject(e)
      })
  })

  return await promise
}

// export default Detailed
// 使用connect()()创建并暴露一个Count的容器组件
export default connect(
  (state) => ({
    defaultState: state,
  }),
  {}
)(Detailed)
