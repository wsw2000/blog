import { Avatar, Divider, Popover } from 'antd'
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
    function reduce() {
      if (i > 0) {
        divTyping.innerHTML = str.slice(0, i--);
        setTimeout(() => { reduce() }, 300)
      }
      else {
        i = 1
        divTyping.innerHTML = '_'
        setTimeout(() => { typing() }, 300)
      }
    }
    function typing() {
      if (i <= str.length) {
        divTyping.innerHTML = str.slice(0, i++) + '_';
        setTimeout(() => { typing() }, 300)
      } else {
        i = str.length
        setTimeout(() => { reduce() }, 1000)
      }
    }
    typing();
  }, [])
  return (
    <>
      <div className="author-div comm-box">
        <div>
          <Avatar size={90} src="http://www.wsw2000.top/huiyi/zhu.png" />
        </div>
        <div className="author-introduction">
          <div id='introduction' style={{ color: 'deeppink', fontWeight: 'bold' }}></div>
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