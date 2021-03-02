import React, { useState } from 'react';
import { Card, Input, Button, Spin, message } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import './index.css'
import apis from '../../utils/request';

const Login = (props) => {
  const [userName, setUserName] = useState('')
  const [passWord, setPassWord] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const checkLogin = async() => {
    setIsLoading(true)
    if(!userName || !passWord) {
      message.error('用户名or密码不能为空')
      setIsLoading(false)
      return
    }
    let userInfo = {
      userName:userName,
      passWord:passWord
    }
    const {data:res} =await apis.loginAdmin(userInfo)
    if(res.data=='登录成功'){
      setIsLoading(false)
      localStorage.setItem('openId',res.openId)
      message.success('登录成功')
      props.history.push('/index')
    }else{
      setIsLoading(false)
      message.error('用户名密码错误')
    }
  }
  return (
    <div className="login-bg">
      <div className="login-div">
        <Spin tip="Loading..." spinning={isLoading}>
          <Card title="JSPang Blog  System" bordered={true} style={{ width: 400 }} >
            <Input
              id="userName"
              size="large"
              placeholder="Enter your userName"
              prefix={<UserOutlined />}
              onChange={(e) => { setUserName(e.target.value) }}
            />
            <br /><br />
            <Input.Password
              id="password"
              size="large"
              placeholder="Enter your password"
              prefix={<KeyOutlined />}
              onChange={(e) => { setPassWord(e.target.value) }}
            />
            <br /><br />
            <Button type="primary" size="large" block onClick={checkLogin} > Login in </Button>
          </Card>
        </Spin>
      </div>
    </div>
  )
}
export default Login