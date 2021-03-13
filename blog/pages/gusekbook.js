import Head from 'next/head'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Author from '../components/Author'
import Footer from '../components/Footer'
import Sentence from '../components/sentence';
import LazyImg  from '../components/lazyImg';
import {connect} from 'react-redux';
import {Row,Col,List,Input,Avatar,Button,Modal,message} from 'antd';
import apis from '../utils/request';
import '../styles/detail.less';
import {timefilter,checkEmail} from '../utils';
const { TextArea } = Input;

const GusekBook = ({defaultState,guestList}) => {
  const [gueskList,setGueskList] = useState(guestList)
  const [headTitle, setHeadTitle] = useState('留言 | 吴绍温个人博客 | 前端学习笔记')
  const [avatar,setAvatar] = useState('')
  const [unamed,setUnamed] = useState('')
  const [email,setEmail] = useState('')
  const [content,setContent] = useState('')
  const [toUnamed,setToUnamed] = useState('')
  const [isReply,setIsReply] = useState(0)  //回复id 默认为0
  const [commentId,setCommentId] = useState(0)  //评论id 默认为0
  const [replyModal, setReplyModal] = useState(false);  
  const [userName, setUserName] = useState('');  
  const [passWord, setPassWord] = useState('');  
  const [location, setLocation] = useState({});  

  const checkTitle = () =>{
    document.addEventListener('visibilitychange',function(){
      var isHidden = document.hidden;
      isHidden && setHeadTitle('呜呜呜~~你离开了我')
      !isHidden && setHeadTitle('留言 | 吴绍温个人博客 | 前端学习笔记')
    })
  }
  useEffect(() => { 
    checkTitle()
    // 在此可以执行任何带副作用操作
    const location = JSON.parse(localStorage.getItem('location')) || {}
    setLocation(location)
    const unamed = localStorage.getItem('unamed') || ''
    const email = localStorage.getItem('email') || ''
    let avatar_url = email.split('@')[0]
    let url = `http://q1.qlogo.cn/g?b=qq&nk=${avatar_url}&s=100`
    setAvatar(url)   //获取qq头像
    setEmail(email)
    setUnamed(unamed)
    setContent('')
    return () => { 
      checkTitle()
      // 在组件卸载前执行
      // 在此做一些收尾工作, 比如清除定时器/取消订阅等
    }
  },[]) 
   //input框设置
   const setPublishInfo = (value,type) =>{
    if(isReply == 0){  //不是回复的
      setCommentId(gueskList.length + 1)  //设置评论id
    }else{
      setCommentId(0)   //回复没有评论id
    }
    if(type == 'unamed'){
      setUnamed(value)
      localStorage.setItem('unamed',value)
    }else if(type == 'email'){
      setEmail(value)
      localStorage.setItem('email',value)
      let avatar_url = value.split('@')[0]
      let url = `http://q1.qlogo.cn/g?b=qq&nk=${avatar_url}&s=100`
      setAvatar(url)
    }else {
      setContent(value)
    }
  }
  //发表评论
  const publishInfo = async() => {
    if(unamed == ''){
      message.error('昵称不能为空')
      return
    }else if(email == '' ){
      message.error('qq邮箱不能为空')
      return
    }else if(!checkEmail(email)) {
      message.error('邮箱格式不对')
      return
    }else if(content == ''){
      message.error('评论不能为空')
      return
    }
    if(email == '944627549@qq.com'){
      const {data: res} =await apis.checkLogin({userName,passWord})
      if(res.code != 1) {
        message.error('哼,登录失败,你不是博主！')
        return
      }
      message.success('主人你回来啦！请发言')

    }
    const commentInfo = {
      article_id:-1,   //留言墙的article_id固定-1
      unamed:unamed,
      email:email,
      address:`${location.province}${location.city}`,
      content:content,
      addTime:Date.now(),
      to_unamed:toUnamed,
      is_reply:isReply,
      comment_id:commentId,
      iconUrl:avatar
    }
  
    const {data} = await apis.publishComment(commentInfo)
    if(data.isScuccess){
      message.success('评论成功！')
      setContent('')
      setIsReply(0)
      setUserName('')
      setPassWord('')
      setReplyModal(false)
      const data = await GusekBook.getInitialProps()
      setGueskList(data.guestList)
    }
  }
  //回复
  const handleReply = (comment_id,toUnamed) =>{
    setCommentId(0)  //评论没有回复id
    setIsReply(comment_id)   //回复id 就是评论的id
    setToUnamed(toUnamed)   //如果有toUnamed则评论
    setReplyModal(true)
  }

  const handleCancel = () => {
    setReplyModal(false);
    setIsReply(0)
  };
  return (
    <div className={["next-box",defaultState.visible ? 'next-right' : ''].join(' ')}>
    <Head>
        <title>{headTitle}</title>
    </Head>
    <Header />
    <Row className="comm-main" type="flex" justify="center">
      <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
        <div className="detailed-comments">
          <div className="publish">
              <Input placeholder="您的称呼"
              value={unamed} onChange={(e)=>{setPublishInfo(e.target.value,'unamed')}}/>
              <div className='publish-email'>
                <Input className="input" value={email} placeholder="您的邮箱"
                onChange={(e)=>{setPublishInfo(e.target.value,'email')}}/>
                  {
                  avatar !== '' ? <Avatar  size={45} src={avatar}/> : <Avatar size={45} icon="user" />
                }
              </div>
              {
                email == '944627549@qq.com' && 
                <div className='publish-email'>
                  <div className='publish-login'>
                    <div>用户名：</div>
                    <Input value={userName} placeholder="用户名"
                    onChange={(e)=>{setUserName(e.target.value,'userName')}}/>
                  </div>
                  <div className='publish-login'>
                    <div>密码：</div>
                    <Input type="password" value={passWord} placeholder="密码"
                    onChange={(e)=>{setPassWord(e.target.value,'passWord')}}/>
                  </div>
                </div> 
              }
              <TextArea rows={6} placeholder="您的留言"
                value={content}
                onChange={(e)=>{setPublishInfo(e.target.value,'content')}}/>
              <Button type="primary"  onClick={publishInfo} style={{width:'100%',marginTop:'8px'}}>发布评论</Button>
            </div>
        </div>
        <List
          className='detailed-comments'
          header={<div className="listTitle">留言列表</div>}
          footer={<div></div>}
          itemLayout="vertical"
          dataSource={gueskList}   // 数据源
          renderItem={item => (
            <div className="commentsItem" key={item.id}>
              <div className="comments-item">
                <div className="icon">
                  <LazyImg src={item.iconUrl || 'https://tva4.sinaimg.cn/large/9bd9b167gy1fwsgqwd0wwj21hc0u0kjl.jpg'}  alt="icon"></LazyImg>
                </div>
                <div className="contaner">
                  <div className="unamed">
                    <div className="name">{item.email == '944627549@qq.com' 
                    ? <div style={{color:'#f6cda6'}}>博主</div>
                    : item.unamed}</div>
                    <div className="replyBtn" onClick={()=>handleReply(item.comment_id)}>回复</div>
                  </div>
                  <div className="time">
                    <div>{item.address ? item.address : 'CHINA'}</div>
                    <div>{timefilter(item.addTime)}</div>
                  </div>
                  <div className="content">{item.content}</div>
                </div>
              </div>       
              {
                item.replyLists.map(item1 => {
                  return (
                    <div className="comments-item reply" key={item1.id}>
                      <div className="icon">
                        <LazyImg src={item1.iconUrl ? item1.iconUrl :'https://tva4.sinaimg.cn/large/9bd9b167gy1fwsgqwd0wwj21hc0u0kjl.jpg'} alt="icon"></LazyImg>
                      </div>
                      <div className="contaner">
                        <div className="unamed">
                          <div className="name">
                          <div className="name">{item1.email == '944627549@qq.com' 
                          ? <div style={{color:'#f6cda6'}}>博主</div>
                          : item1.unamed}</div>
                          </div>
                          {
                            item1.to_unamed ?
                            <>
                              <div>回复</div>
                              <div className="name">{item1.to_unamed}</div>
                            </>
                            : <div className="replyBtn" onClick={()=>handleReply(item.comment_id,item1.unamed)}>回复</div>
                            
                          }
                        </div>
                        <div className="time">
                          <div>{item1.address ? item1.address : 'CHINA'}</div>
                          <div>{timefilter(item1.addTime)}</div>
                        </div>
                        <div className="content">{item1.content}</div>
                      </div>
                    </div>    
                  )
                })
              }           
            </div> 
          )}
        />
         <Modal title="回复~~" visible={replyModal} 
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                取消
              </Button>
            ]}>
              <div className="detailed-comments">
                <div className="publish">
                  <Input placeholder="您的称呼"
                  value={unamed} onChange={(e)=>{setPublishInfo(e.target.value,'unamed')}}/>
                  <div className='publish-email'>
                    <Input className="input" value={email} placeholder="您的邮箱"
                    onChange={(e)=>{setPublishInfo(e.target.value,'email')}}/>
                      {
                      avatar !== '' ? <Avatar  size={45} src={avatar}/> : <Avatar size={45} icon="user" />
                    }
                  </div>
                  {
                    email == '944627549@qq.com' && 
                    <div className='publish-email'>
                      <div className='publish-login'>
                        <div>用户名：</div>
                        <Input value={userName} placeholder="用户名"
                        onChange={(e)=>{setUserName(e.target.value,'userName')}}/>
                      </div>
                      <div className='publish-login'>
                        <div>密码：</div>
                        <Input type="password" value={passWord} placeholder="密码"
                        onChange={(e)=>{setPassWord(e.target.value,'passWord')}}/>
                      </div>
                    </div> 
                  }
                  <TextArea rows={6} placeholder="您的留言"
                    value={content}
                    onChange={(e)=>{setPublishInfo(e.target.value,'content')}}/>
                  <Button type="primary"  onClick={publishInfo} style={{width:'100%',marginTop:'8px'}}>发布评论</Button>
                </div>
              </div>
            </Modal>
      </Col>
      <Col className="comm-right cssniceright" xs={0} sm={0} md={7} lg={5} xl={4}>
        <Author />
        <Sentence/>
      </Col>
    </Row>
    <Footer/>
  </div>
  )
}

GusekBook.getInitialProps = async () => {
  const { data: res } = await apis.getGusekList()
  if(res.code != 1) return
  return {guestList:res.data}
}
export default connect (
  state => ({
    defaultState: state,
  }),{}
)(GusekBook)