import { Avatar, Divider, Popover,Tag } from 'antd'
import { useEffect, useState } from 'react';
import './index.less'
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
const Author = () => {
  const [photoImages, setPhotoImages] = useState(['http://www.wsw2000.top/images/qq.png', 'http://www.wsw2000.top/images/wechat.png']);
  const [visible, setVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const handlePhoto = (val) => {
    setPhotoIndex(val)
    setVisible(true)
  }
  useEffect(() => {
    var str = "天生我材必有用，千金散尽还复来。"
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
        <div>
          <Avatar size={90} src="http://www.wsw2000.top/huiyi/zhu.png" />
        </div>
        <div className="author-introduction">
          <div id='introduction' style={{ color: 'deeppink', fontWeight: 'bold' }}>
            天生我材必有用，千金散尽还复来。
          </div>
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
          <Popover content={'https://github.com/wsw2000'} placement="bottom">
            <a href="https://github.com/wsw2000">
              <Avatar size={28} icon="github" className="account" />
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
            <Avatar size={28} icon="qq" className="account" />
          </Popover>
          <Popover content={<><img src="http://www.wsw2000.top/images/wechat.png" onClick={() => handlePhoto(1)} style={{ width: '150px' }} alt="wechat" /></>} placement="bottom">
            <Avatar size={28} icon="wechat" className="account" />
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

export default Author