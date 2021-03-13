import React, { useState, useEffect } from 'react'
import { Row, Col, Menu, Icon, Drawer, Tooltip, Popover, Spin } from 'antd'
import { connect } from 'react-redux'
import { changeThemeType,changeFixed,changeVisible } from '../../redux/action';
import './index.less'
import Link from 'next/link';
import api from '../../utils/request';
import Router from 'next/router';
import IconFont from '../IconFont'
import Author from '../Author'; 
import Sentence from '../sentence';
import { loadScript } from '../../utils'
import WeatherContent from '../WeatherContent';
const Header = (props) => {
  const [listType, setlistType] = useState([])
  const [menuFlag, setMenuFlag] = useState(false);
  // 暗黑主题类型
  const [theme, setTheme] = useState(0)
  // 天气
  const [ipLong, setIpLong] = useState(null)
  const [ipWeather, setIpWeather] = useState(null)
  const [weatherInfo, setWeatherInfo] = useState(null)
  useEffect(async () => {
    const { data: res } = await api.getActicleType()
    setlistType(res.data)
    return () => {
      // setVisible(false)
      setlistType([])
    }
  }, [])
  //跳转到列表页
  const handleClick = (e) => {
    if (e.key == 0) {
      Router.push('/index')
      return
    }
    if(e.key == 4) {
      Router.push('/gusekbook')
      return
    }
    Router.push(`/list?id=${e.key}`)
  }
  const handleMenu = () => {
    setMenuFlag((menuFlag) => {
      return !menuFlag
    })
    props.changeVisible({flag:true,listType})
  }
  const hideVisible = () => {
    props.changeVisible({flag:false,listType:[]})
  }

  const getIpWeatherInfo = () => {
    //获取天气接口
    api.getIpWeather().then(async res => {
      if (res.data.status != 200) return
      setIpWeather(res.data.data[0])
      const adlng = res.data.data[0].adlng
      const adlat = res.data.data[0].adlat
      localStorage.setItem('location',JSON.stringify({
        province:res.data.data[0].province,
        city:res.data.data[0].city
      }))
      setIpLong({ adlng, adlat })
      const weatherInfo = await api.getWeather(adlng, adlat)
      // console.log('getWeather',weatherInfo);
      if (weatherInfo.status !== 200 && weatherInfo.data) return
      setWeatherInfo(weatherInfo.data)
    })
  }
  const changeTheme = () => {
    try {
      loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.17/darkreader.min.js', () => {
        const proxyFetch = (url) => {
          return fetch('https://cors-anywhere.herokuapp.com/' + url);
        }
        DarkReader.setFetchMethod(proxyFetch);
          if (localStorage.getItem('themeType')) {
            setTheme((localStorage.getItem('themeType')) * 1)
          } else {
            setTheme(1)
          }    
      })
    } catch (error) {
      
    }
  }
  //检测是否滚动
  const scrollMove = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop >= 100) {
      props.changeFixed(true)
    }else {
      props.changeFixed(false)
    }
  }
  // 支持暗黑主题 + 获取ip信息 + 天气信息
  useEffect(() => {
    getIpWeatherInfo()
    changeTheme()
    window.addEventListener('scroll', scrollMove)
  }, [])
  //主题变化而更新
  useEffect(() => {
    switch (theme) {
      ///当系统颜色方案为深色时启用。
      case 1:
        DarkReader.auto({
          brightness: 100,
          contrast: 90,
          sepia: 10
        });
        break;
      case 2:
        //明亮
        DarkReader.disable();
        break;
      case 3:
        //暗黑模式
        DarkReader.enable({
          brightness: 100,
          contrast: 90,
          sepia: 10
        });
        break;
    }
    props.changeThemeType(theme)   //缓存
  }, [theme])

  const switchTheme = () => { 
    if (theme == 3) {
      setTheme(1)
      props.changeThemeType(1)
      localStorage.setItem('themeType', 1)
    } else {
      setTheme(theme * 1 + 1)
      localStorage.setItem('themeType', theme * 1 + 1)
      props.changeThemeType(theme * 1 + 1)
    }
  }
  const returnTheme = () => {
    let arr = [{ icon: 'icon-huaban' }, { icon: 'icon-huaban' }, { icon: 'icon-sun' }, { icon: 'icon-moon' }]
    return arr[theme].icon
  }

  return (
    <>
    {/* {xs< 576px sm≥ 576px md≥ 768px lg≥ 992px xl ≥ 1200px xxl≥ 1600px } */}
      <div className={["header",props.defaultState.isFixed ? 'header-fixed' : ''].join(' ')}>
        <Row type="flex" justify="center">
          <Col xs={18} sm={8} md={6} lg={4} xl={6}>
            <span className="header-logo">
              <Link href={{ pathname: '/index' }}>
                <a> Wsw</a>
              </Link>
            </span>
            <span className="header-title">学习前端的记录站</span>
          </Col>
          <Col xs={0} sm={10} md={6} lg={6} xl={6}>
            {
              ipWeather &&
              <span className="header-weather">
                <Popover placement="bottom" 
                content={<WeatherContent weatherInfo={weatherInfo} ipWeather={ipWeather} ipLong={ipLong}/>} 
                trigger="hover">
                  <div className='weather-title-box'>
                    {
                      weatherInfo && weatherInfo.now &&
                      <span className="wearther-span" style={{ marginRight: '10px' }}>{ipWeather.district || ipWeather.city}</span>
                    }
                    {
                      weatherInfo && weatherInfo.now &&
                      <>
                        <img style={{ width: 20, height: 20, marginRight: 5 }} src={`http://cdn.blogleeee.com/custom${weatherInfo.now.icon}.png`} />
                        <span className="wearther-span">{weatherInfo.now.text}</span>
                        <span className="wearther-span">{weatherInfo.now.temp}℃</span>
                      </>
                    }
                  </div>
                </Popover>
              </span>
            }
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2}>
            <span style={{ lineHeight: '2.8rem' }}>
              <Tooltip
                placement="bottom"
                title={'主题模式：' + { 1: '默认', 2: '明亮', 3: '暗黑' }[theme]} >
                <IconFont
                  type={returnTheme()}
                  style={{ paddingTop: '.7rem', fontSize: 24, cursor: 'pointer' }}
                  onClick={switchTheme}
                />
              </Tooltip>
            </span>
          </Col>
          <Col xs={0} sm={0} md={10} lg={12} xl={10}>
            <Menu mode="horizontal" onClick={handleClick}>
              <Menu.Item key="0">
                <Icon type="home" />首页
              </Menu.Item>
              {
                listType.map(item => {
                  return (
                    <Menu.Item key={item.id}>
                      <Icon type={item.icon} />{item.typeName}
                    </Menu.Item>
                  )
                })
              }
            </Menu>
          </Col>
          <Col xs={2} sm={2} md={0} lg={0} xl={0}>
            <div className="menuIcon" 
            style={{ fontSize: 20, cursor: 'pointer' }}
            onClick={handleMenu}>
              {
                menuFlag ? <Icon type="menu-unfold" />
                  : <Icon type="menu-fold" />
              }
            </div>
          </Col>
        </Row>
        <Drawer
          placement="right"
          closable={true}
          onClose={hideVisible}
          visible={props.defaultState.visible}
          width={'80%'}
        >
          <div>
            <Author></Author>
            <Sentence></Sentence>
            <WeatherContent weatherInfo={weatherInfo} ipWeather={ipWeather} ipLong={ipLong}/>
          </div>
        </Drawer>
      </div>
    </>
  )
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(
  state => ({
    defaultState: state,
  }),
  { changeThemeType,changeFixed,changeVisible }
)(Header)