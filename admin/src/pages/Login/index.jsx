import React, { useState } from 'react';
import { Card, Input, Button, Spin, message } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons'
import './index.css'
import apis from '../../utils/request';
import Particles from 'react-particles-js'; //粒子背景

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
    if(res.data === '登录成功'){
      setIsLoading(false)
      localStorage.setItem('openId',res.openId)
      message.success('登录成功')
      props.history.push('/')
    }else{
      setIsLoading(false)
      message.error('用户名密码错误')
    }
  }
  return (
    <div className="login-bg">
      <Particles 
         params={{
          particles: {
            number: {
              value: 160,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#ffffff'
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000'
              },
              polygon: {
                nb_sides: 5
              },
              image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
              }
            },
            opacity: {
              value: 1,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 4,
                size_min: 0.3,
                sync: false
              }
            },
            line_linked: {
              enable: false,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 600
              }
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'bubble'
              },
              onclick: {
                enable: true,
                mode: 'repulse'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 250,
                size: 0,
                duration: 2,
                opacity: 0,
                speed: 3
              },
              repulse: {
                distance: 400,
                duration: 0.4
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        }}
        style={{
          width: '100%',
          position: 'absolute'
        }}
      />
      <div className="login-div">
        <Spin tip="Loading..." spinning={isLoading}>
          <Card title="Wsw Blog System" bordered={true} style={{ width: 400 }} >
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
              onPressEnter={checkLogin}
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