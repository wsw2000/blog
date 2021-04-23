import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import Sentence from '../components/sentence'
import LazyImg from '../components/lazyImg'
import { connect } from 'react-redux'
import { Row, Col, List, Input, Avatar, Button, Modal, message } from 'antd'
import apis from '../utils/request'
import '../styles/detail.less'
import { timefilter, checkEmail } from '../utils'
const { TextArea } = Input
import Comment from '../components/Comment'
import myContext from '../components/createContext.js'
const GusekBook = ({ defaultState, guestList }) => {
  const [gueskList, setGueskList] = useState(guestList)
  const [headTitle, setHeadTitle] = useState(
    '留言 | 吴绍温个人博客 | 前端学习笔记'
  )
  const [toUnamed, setToUnamed] = useState('')
  const [isReply, setIsReply] = useState(0) //回复id 默认为0
  const [commentId, setCommentId] = useState(0) //评论id 默认为0
  const [replyModal, setReplyModal] = useState(false)

  const checkTitle = () => {
    document.addEventListener('visibilitychange', function () {
      var isHidden = document.hidden
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('留言 | 吴绍温个人博客 | 前端学习笔记')
    })
  }
  useEffect(() => {
    checkTitle()
    return () => {
      checkTitle()
      // 在组件卸载前执行
      // 在此做一些收尾工作, 比如清除定时器/取消订阅等
    }
  }, [])

  //发表评论
  const publishInfo = (commentInfo) => {
    if (!commentInfo) return

    return new Promise(async (resolve, reject) => {
      const { data } = await apis.publishComment(commentInfo)
      if (data.isScuccess) {
        message.success('评论成功！')
        setReplyModal(false)
        setIsReply(0) //回复成功后 回复id重置
        resolve('success') // 向子组件传值
        const data = await GusekBook.getInitialProps()
        setGueskList(data.guestList)
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
  return (
    <div
      className={['next-box', defaultState.visible ? 'next-right' : ''].join(
        ' '
      )}
    >
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Header />
      <Row className='comm-main' type='flex' justify='center'>
        <Col className='comm-left' xs={24} sm={24} md={16} lg={18} xl={14}>
          <div className='detailed-comments'>
            <myContext.Provider
              value={{
                articleId: -1,
                comments_length: gueskList.length,
                toUnamed: toUnamed,
                isReply: isReply,
                commentId: commentId,
              }}
            >
              <Comment publishInfo={publishInfo}></Comment>
            </myContext.Provider>
          </div>
          <List
            className='detailed-comments'
            header={<div className='listTitle'>留言列表</div>}
            footer={<div></div>}
            itemLayout='vertical'
            dataSource={gueskList} // 数据源
            renderItem={(item) => (
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
                                <div style={{ color: '#f6cda6' }}>博主</div>
                              ) : (
                                item1.unamed
                              )}
                            </div>
                          </div>
                          {item1.to_unamed ? (
                            <>
                              <div>回复</div>
                              <div className='name'>{item1.to_unamed}</div>
                            </>
                          ) : (
                            <div
                              className='replyBtn'
                              onClick={() =>
                                handleReply(item.comment_id, item1.unamed)
                              }
                            >
                              回复
                            </div>
                          )}
                        </div>
                        <div className='time'>
                          <div>{item1.address ? item1.address : 'CHINA'}</div>
                          <div>{timefilter(item1.addTime)}</div>
                        </div>
                        <div className='content'>{item1.content}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          />
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
                  articleId: -1,
                  comments_length: gueskList.length,
                  toUnamed: toUnamed,
                  isReply: isReply,
                  commentId: commentId,
                }}
              >
                <Comment publishInfo={publishInfo}></Comment>
              </myContext.Provider>
            </div>
          </Modal>
        </Col>
        <Col
          className='comm-right cssniceright'
          xs={0}
          sm={0}
          md={7}
          lg={5}
          xl={4}
        >
          <Author />
          <Sentence />
        </Col>
      </Row>
      <Footer />
    </div>
  )
}

GusekBook.getInitialProps = async () => {
  const { data: res } = await apis.getGusekList()
  if (res.code != 1) return
  return { guestList: res.data }
}
export default connect(
  (state) => ({
    defaultState: state,
  }),
  {}
)(GusekBook)
