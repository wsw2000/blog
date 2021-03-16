import { Avatar, Divider, Popover,Tag,Menu,Icon } from 'antd'
import { useEffect, useState } from 'react';
import Router from 'next/router';
import './index.less'
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import {connect} from 'react-redux';
import {changeVisible} from '../../redux/action';
import 'react-photo-view/dist/index.css';
const Author = (props) => {
  const [photoImages, setPhotoImages] = useState(['http://www.wsw2000.top/images/qq.png', 'http://www.wsw2000.top/images/wechat.png']);
  const [visible, setVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const handlePhoto = (val) => {
    setPhotoIndex(val)
    setVisible(true)
  }
  //跳转到列表页
  const handleClick = (e) => {
    props.changeVisible({flag:false,listType:[]})
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
  useEffect(() => {
    var str = "每天都要进步"
    var i = 0;
    var divTyping = document.getElementById('introduction')
    const timeNull = {}
    const reduce = () => {
      if (i > 0) {
        divTyping.innerHTML = str.slice(0, i--);
        timeNull.null1 =  setTimeout(() => { reduce() }, 500)
      }
      else {
        i = 1
        divTyping.innerHTML = '_'
        timeNull.null2 = setTimeout(() => { typing() }, 500)
      }
    }
    const typing = () =>{
      if (i <= str.length) {
        divTyping.innerHTML = str.slice(0, i++) + '_';
        timeNull.null2 = setTimeout(() => { typing() }, 500)
      } else {
        i = str.length
        timeNull.null1 = setTimeout(() => { reduce() }, 500)
      }
    }
    reduce();
    return ()=>{
      clearTimeout(timeNull.null1)
      clearTimeout(timeNull.null2)
    }
  },[])
  return (
    <>
      <div className="author-div comm-box">
        <div style={{cursor:'pointer'}}>
          <Avatar onClick={()=> window.location.href='http://www.wsw2000.top:3000/'} size={90} src="http://www.wsw2000.top/images/avatar.png" />
        </div>
        <div className="author-introduction">
          <div id='introduction' style={{ color: 'deeppink', fontWeight: 'bold' }}>
          每天都要进步
          </div>
          {
            props.defaultState && props.defaultState.listType && props.defaultState.visible ?
            <>
              <Divider>导航</Divider>
              <Menu 
              style={{width:'60%',margin:'0 auto',borderRight:'0'}} 
              mode="vertical" 
              onClick={handleClick}>
                <Menu.Item key="0">
                  <Icon type="home" />首页
                </Menu.Item>
              {
                props.defaultState.listType.map(item => {
                  return (
                    <Menu.Item key={item.id}>
                      <Icon type={item.icon} />{item.typeName}
                    </Menu.Item>
                  )
                })
              }
            </Menu>
            </> : null
          }
          <Divider>技能</Divider>
          <div>
            <Tag color="cyan">Vue</Tag>
            <Tag color="blue">React</Tag>
            <Tag color="geekblue">Egg.js</Tag>
          </div>
          <div>
            <Tag color="magenta">UniApp</Tag>
            <Tag color="lime">小程序</Tag>
            <Tag color="green">Js</Tag>
          </div>
          <Divider>社交帐号</Divider>
           <Popover content={'码云：https://gitee.com/wu_chao_wen'} placement="bottom">
            <a href="https://gitee.com/wu_chao_wen" target='_blank'> 
              <Avatar style={{background:(props.defaultState.isFixed)?'#c2bdeb':'#999999'}} size={28}  className="account">
               gitee
              </Avatar>
            </a>
          </Popover>
          <Popover content={'GitHub：https://github.com/wsw2000'} placement="bottom">
            <a href="https://github.com/wsw2000" target='_blank'> 
              <Avatar style={{background:(props.defaultState.isFixed)?'#c2bdeb':'#999999'}} size={28} icon="github" className="account" />
            </a>
          </Popover>
          <Popover
            content={
              <>
                <img src="http://www.wsw2000.top/images/qq.png"
                  style={{ width: '150px' }} alt="qq"
                  onClick={() => handlePhoto(0)}
                />
              </>
            } placement="bottom">
            <Avatar style={{background:(props.defaultState.isFixed)?'#c2bdeb':'#999999'}} size={28} icon="qq" className="account" />
          </Popover>
          <Popover content={<><img src="http://www.wsw2000.top/images/wechat.png" onClick={() => handlePhoto(1)} style={{ width: '150px' }} alt="wechat" /></>} placement="bottom">
            <Avatar style={{background:(props.defaultState.isFixed)?'#c2bdeb':'#999999'}} size={28} icon="wechat" className="account" />
          </Popover>
        </div>
      </div>
      <PhotoSlider
        images={photoImages.map(item => ({ src: item }))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
    </>
  )
}

export default connect(
  state => ({
    defaultState: state,
  }),{changeVisible}
)(Author)