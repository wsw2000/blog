import moment from 'moment';
import {Spin} from 'antd';
const WeatherContent = (props) => {
  const {weatherInfo,ipLong,ipWeather} = props
  return (
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
            width="100%"
            height="40px"
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
}

export default WeatherContent