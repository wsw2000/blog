import React, { useState, useEffect, useContext, useRef } from 'react'
import '../../styles/detail.less'
import { timefilter, checkEmail } from '../../utils/index'
import api from '../../utils/request'
import { Input, Avatar, Button, message, Icon, Popover } from 'antd'
import myContext from '../createContext'

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
// 表情插件汉化
const i18n = {
  search: '搜索',
  clear: '清除', // Accessible label on "clear" button
  notfound: '木有数据',
  skintext: '选择默认肤色',
  categories: {
    search: '搜索结果',
    recent: '常用',
    smileys: '笑脸',
    people: '情绪和人',
    nature: '动物与自然',
    foods: '食物',
    activity: '活动',
    places: '旅行和地点',
    objects: '物体',
    symbols: '符号',
    flags: '旗帜',
    custom: '自定义',
  },
  categorieslabel: '表情类别', // Accessible title for the list of categories
  skintones: {
    1: '默认肤色',
    2: '浅肤色',
    3: '中浅肤色',
    4: '中等肤色',
    5: '中深色肤色',
    6: '深色肤色',
  },
}
const { TextArea } = Input
const Comment = (props) => {
  const Context = useContext(myContext)
  const textAreaRef = useRef()
  const inoutss = useRef()
  const [avatar, setAvatar] = useState('')
  const [unamed, setUnamed] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('') //回复内容
  const [commentId, setCommentId] = useState(Context.commentId) //评论id 默认为0
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [visible, setVisible] = useState(false)
  const [location, setLocation] = useState({})
  const [contentProps, sercontentProps] = useState(null)
  useEffect(() => {
    const location = JSON.parse(localStorage.getItem('location')) || {}
    setLocation(location)
    const unamed = localStorage.getItem('unamed') || ''
    const email = localStorage.getItem('email') || ''
    let avatar_url = email.split('@')[0]
    let url = `http://q1.qlogo.cn/g?b=qq&nk=${avatar_url}&s=100`
    setAvatar(url) //获取qq头像
    setEmail(email)
    setUnamed(unamed)
    setContent('')
    setCommentId(Context.commentId)
  }, [])
  // 添加表情
  const addEmoji = (e) => {
    //获取光标位置方法
    const getPositionForTextArea = (ctrl) => {
      let CaretPos = {
        start: 0,
        end: 0,
      }
      if (ctrl.selectionStart) {
        // Firefox support
        CaretPos.start = ctrl.selectionStart
      }
      if (ctrl.selectionEnd) {
        CaretPos.end = ctrl.selectionEnd
      }
      return CaretPos
    }
    // 重新定位光标方法
    const setCursorPosition = (ctrl, pos) => {
      ctrl.focus()
      ctrl.selectionStart = pos
      ctrl.selectionEnd = pos
    }

    // 插入修改字符串方法
    const insertStr = (soure, start, newStr) => {
      return soure.slice(0, start) + newStr + soure.slice(start)
    }
    const position = getPositionForTextArea(textAreaRef.current) //获取光标位置
    let newValue = insertStr(content, position.start, e.native) // 设置value
    setContent(newValue)

    // 重新定位光标 不加延时器就会发生光标还没插入文字呢 就已经把光标插入后的位置提前定位
    setTimeout(() => {
      setCursorPosition(textAreaRef.current, position.start + newValue.length)
    }, 20)
    setVisible(false)
  }

  const setPublishInfo = (value, type) => {
    if (Context.isReply == 0 || !Context.isReply) {
      //不是回复的
      setCommentId(Context.comments_length + 1) //设置评论id
    } else {
      setCommentId(0) //回复没有评论id
    }
    if (type == 'unamed') {
      setUnamed(value)
      localStorage.setItem('unamed', value)
    } else if (type == 'email') {
      setEmail(value)
      localStorage.setItem('email', value)
      let avatar_url = value.split('@')[0]
      let url = `http://q1.qlogo.cn/g?b=qq&nk=${avatar_url}&s=100`
      setAvatar(url)
    } else {
      setContent(value)
    }
  }
  const publishInfo = async () => {
    if (unamed == '') {
      message.error('昵称不能为空')
      return
    } else if (email == '') {
      message.error('qq邮箱不能为空')
      return
    } else if (!checkEmail(email)) {
      message.error('邮箱格式不对')
      return
    } else if (content == '') {
      message.error('评论不能为空')
      return
    }
    if (email == '944627549@qq.com') {
      const { data: res } = await api.checkLogin({ userName, passWord })
      if (res.code != 1) {
        message.error('哼,登录失败,你不是博主！')
        return
      }
      message.success('主人你回来啦！请发言')
    }
    const commentInfo = {
      article_id: Context.articleId, //留言墙的article_id固定-1
      unamed: unamed,
      email: email,
      address: `${location.province}${location.city}`,
      content: content,
      addTime: Date.now(),
      to_unamed: Context.toUnamed,
      is_reply: Context.isReply,
      comment_id: commentId,
      iconUrl: avatar,
    }
    props.publishInfo(commentInfo).then((status) => {
      if (status == 'success') {
        setContent('')
        setUserName('')
        setPassWord('')
      }
    }) //向父子件传值
  }
  return (
    <>
      <div className='publish'>
        <Input
          placeholder='您的称呼'
          value={unamed}
          onChange={(e) => {
            setPublishInfo(e.target.value, 'unamed')
          }}
        />
        <div className='publish-email'>
          <Input
            className='input'
            value={email}
            placeholder='您的邮箱'
            onChange={(e) => {
              setPublishInfo(e.target.value, 'email')
            }}
          />
          {avatar !== '' ? (
            <Avatar size={45} src={avatar} />
          ) : (
            <Avatar size={45} icon='user' />
          )}
        </div>
        {email == '944627549@qq.com' && (
          <div className='publish-email'>
            <div className='publish-login'>
              <div>用户名：</div>
              <Input
                value={userName}
                placeholder='用户名'
                onChange={(e) => {
                  setUserName(e.target.value)
                }}
              />
            </div>
            <div className='publish-login'>
              <div>密码：</div>
              <Input
                type='password'
                value={passWord}
                placeholder='密码'
                onChange={(e) => {
                  setPassWord(e.target.value)
                }}
              />
            </div>
          </div>
        )}
        <textarea
          rows={4}
          value={content}
          onChange={(e) => {
            setPublishInfo(e.target.value, 'content')
          }}
          placeholder='请文明发言哦'
          ref={textAreaRef}
          className='inputArea'
        />
        <div className='publish-btn'>
          <Button
            type='primary'
            onClick={publishInfo}
            style={{ width: '70%', marginTop: '8px' }}
          >
            发布评论
          </Button>
          <Popover
            visible={visible}
            content={
              <div className='emoji-box'>
                <Picker
                  set='apple'
                  color='#1890ff'
                  theme='auto'
                  emoji='point_up'
                  onSelect={addEmoji}
                  showPreview={false}
                  showSkinTones={false}
                  i18n={i18n}
                  style={{ border: 'none' }}
                />
              </div>
            }
            placement='bottomRight'
            trigger='click'
          >
            <div
              onClick={() => setVisible(true)}
              style={{ width: '10%', height: '100%', cursor: 'pointer' }}
            >
              <Icon
                type='smile'
                theme='filled'
                style={{ fontSize: '1.2rem' }}
              />
            </div>
          </Popover>
        </div>
      </div>
    </>
  )
}
export default Comment
