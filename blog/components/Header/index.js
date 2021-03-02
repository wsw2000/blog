import React, { useState, useEffect } from 'react'
import { Row, Col, Menu, Icon, Drawer, Tooltip, Popover, Spin } from 'antd'
import { connect } from 'react-redux'
import { changeThemeType } from '../../redux/action';
import './index.less'
import Link from 'next/link';
import api from '../../utils/request';
import Router from 'next/router';
import IconFont from '../IconFont'
import moment from 'moment'
import Author from '../Author';
import Sentence from '../sentence';
import { loadScript } from '../../utils'
const Header = (props) => {
  const [visible, setVisible] = useState(false);
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
  }, [])
  //跳转到列表页
  const handleClick = (e) => {
    if (e.key == 0) {
      Router.push('/index')
      return
    }
    Router.push(`/list?id=${e.key}`)
  }
  const handleMenu = () => {
    setMenuFlag((menuFlag) => {
      return !menuFlag
    })
    setVisible(true)
  }
  const hideVisible = () => {
    setVisible(false)
  }

  const getIpWeatherInfo = () => {
    //获取天气接口
    api.getIpWeather().then(async res => {

      if (res.status !== 200 || !res.data.data[0]) return
      setIpWeather(res.data.data[0])
      const adlng = res.data.data[0].adlng
      const adlat = res.data.data[0].adlat
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
  // 支持暗黑主题 + 获取ip信息 + 天气信息
  useEffect(() => {
    getIpWeatherInfo()
    changeTheme()
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
  // 天气组件
  const WeatherContent = (
    <div id="weather-content">
      {
        weatherInfo && weatherInfo.now && ipWeather.city &&
        <>
          <div className="weather-content-info1">
            <div className="weather-content-left">
              <div className="temp">
                {weatherInfo.now.temp}
                <span style={{ fontSize: 16, fontWeight: 300, color: '#999' }}>℃</span>
              </div>
              <div className="address">
                {
                  weatherInfo.daily[0] && 
                  <div className="temp-text">
                    <span style={{ marginLeft: '5px' }}>{weatherInfo.daily[0].tempMin}</span>
                    <span style={{ fontSize: 12, fontWeight: 300, color: '#999', marginTop: 2 }}>℃</span>
                    <span style={{ margin: '0 5px' }}>-</span>
                    {weatherInfo.daily[0].tempMax}
                    <span style={{ fontSize: 12, fontWeight: 300, color: '#999', marginTop: 2 }}>℃</span>
                  </div>
                }

              </div>
              <p className="trend">{weatherInfo.summary}</p>
            </div>

            <div className="weather-content-right">
              <img src={`http://cdn.blogleeee.com/custom${weatherInfo.now.icon}.png`} />
            </div>
          </div>

          {
            weatherInfo.warning[0] &&
            <div className="warning-box">
              <WarningOutlined style={{ marginRight: 10, color: '#ff4d4f', fontSize: 18 }} />
              <div className="warning">{weatherInfo.warning[0].text}</div>
            </div>
          }
          <div className="info2">
            <div className="option">
              <div className="item">
                <p className="tit">日出日落</p>
                <p className="con">
                  {moment(weatherInfo.sunmoon.sunrise).format('HH:mm')} -
                {moment(weatherInfo.sunmoon.sunset).format('HH:mm')}
                </p>
              </div>
              <div className="item">
                <p className="tit">湿度</p>
                <p className="con">{weatherInfo.now.humidity}%</p>
              </div>
            </div>
            <div className="option">
              <div className="item">
                <p className="tit">风速</p>
                <p className="con">{weatherInfo.now.windDir} {weatherInfo.now.windScale}级</p>
              </div>
              <div className="item">
                <p className="tit">气压</p>
                <p className="con">{weatherInfo.now.pressure}hpa</p>
              </div>
            </div>
          </div>

          {/* 天气实况图 */}
          {
            ipLong &&
            <iframe
              width="400"
              height="150"
              src={`https://embed.windy.com/embed2.html?lat=${ipLong.adlat}&lon=${ipLong.adlng}&detailLat=34.069&detailLon=-118.323&width=380&height=200&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
              frameBorder="0"
            >
            </iframe>
          }


          <div className="info3">
            <div className="future">
              <div className="title">未来7小时</div>
              <ul className="list">
                {
                  weatherInfo.hourly.slice(0, 7).map((item, index) => (
                    <li className="item" key={index}>
                      <img src={`http://cdn.blogleeee.com/${item.icon}.png`} />
                      <div className="temp">{item.temp}</div>
                      <div className="time">{moment(item.fxTime).format('HH')}时</div>
                    </li>
                  ))
                }
              </ul>
            </div>

            <div className="future">
              <div className="title">未来7天</div>
              <ul className="list">
                {
                  weatherInfo.daily.map((item, index) => (
                    <li className="item" key={index}>
                      <img src={`http://cdn.blogleeee.com/${item.iconDay}.png`} />
                      <div className="temp">{item.tempMax}</div>
                      <div className="time">{moment(item.fxDate).format('dddd')}</div>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>

          <p style={{ fontSize: 12, textAlign: 'center', color: '#999', margin: '20px 0 10px' }}>
            天气实况推送
          {/* 数据更新： {moment(weatherInfo.updateTime).startOf('min').fromNow()}  */}
          </p>
        </>
      }
      {
        (!weatherInfo || !weatherInfo.now) && <Spin tip="祈祷中..." />
      }
    </div>
  )
  return (
    <>
    {/* {xs< 576px sm≥ 576px md≥ 768px lg≥ 992px xl ≥ 1200px xxl≥ 1600px } */}
      <div className="header">
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
                <Popover placement="bottom" content={WeatherContent} trigger="hover">
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
          <Col xs={0} sm={0} md={8} lg={10} xl={8}>
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
          visible={visible}
        >
          <div>
            <Author></Author>
            <Sentence></Sentence>
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
  { changeThemeType }
)(Header)