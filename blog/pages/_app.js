import App from 'next/app'
import 'antd/dist/antd.less'
import '../styles/globals.less'
import dynamic from 'next/dynamic';
const Layout = dynamic(import('../components/layout'), { ssr: false })
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Router from 'next/router'
import { memorial } from '../utils/index';
import {Provider} from 'react-redux'
import store from '../redux/store'

export default class MyApp extends App {
  state = {}

  componentDidMount() {
    //国家公祭日,主页变灰色
    memorial()
    console.log('%c 欢迎来到 wsw_blog! ', 'background: rgba(18, 141, 244, 0.1); color: #1890ff');
    // 点击 核心价值观
    let index = 0;
    const fnTextPopup = (event) => {
      let arr = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善']
      if (!arr || !arr.length) {
        return;
      }
      let x = event.pageX,
        y = event.pageY;
      let eleText = document.createElement('span');
      eleText.className = 'text-popup';
      document.documentElement.appendChild(eleText);
      if (arr[index]) {
        eleText.innerHTML = arr[index];
      } else {
        index = 0;
        eleText.innerHTML = arr[0];
      }
      // 动画结束后删除自己
      eleText.addEventListener('animationend', function () {
        eleText.parentNode.removeChild(eleText);
      });
      // 位置
      eleText.style.left = (x - eleText.clientWidth / 2) + 'px';
      eleText.style.top = (y - eleText.clientHeight) + 'px';
      // index递增
      index++;
    };

    const attr = (node, attr, default_value) => {
      return Number(node.getAttribute(attr)) || default_value;
    }

    var scripts = document.getElementsByTagName('script')
    let script = scripts[scripts.length - 1] // 当前加载的script
    let config = {
      z: attr(script, "zIndex", -1), // z-index
      a: attr(script, "alpha", 0.6), // alpha
      s: attr(script, "size", 300), // size
    };

    var canvas = document.createElement('canvas')
    let g2d = canvas.getContext('2d')
    let pr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight
    let f = config.s
    let q, t
    let m = Math
    let r = 0
    let pi = m.PI * 2
    let cos = m.cos
    let random = m.random
    canvas.width = width * pr;
    canvas.height = height * pr;
    g2d.scale(pr, pr);
    g2d.globalAlpha = config.a;
    canvas.style.cssText = 'opacity: ' + config.a + ';position:fixed;top:0;left:0;z-index: ' + config.z + ';width:100%;height:100%;pointer-events:none;';
    // create canvas
    document.getElementsByTagName('body')[0].appendChild(canvas);
    const redraw = () => {
      g2d.clearRect(0, 0, width, height);
      q = [{ x: 0, y: height * 0.7 + f }, { x: 0, y: height * 0.7 - f }];
      while (q[1].x < width + f) draw(q[0], q[1]);
    }
    const draw = (i, j) => {
      g2d.beginPath();
      g2d.moveTo(i.x, i.y);
      g2d.lineTo(j.x, j.y);
      var k = j.x + (random() * 2 - 0.25) * f, n = line(j.y);
      g2d.lineTo(k, n);
      g2d.closePath();
      r -= pi / -50;
      g2d.fillStyle = '#' + (cos(r) * 127 + 128 << 16 | cos(r + pi / 3) * 127 + 128 << 8 | cos(r + pi / 3 * 2) * 127 + 128).toString(16);
      g2d.fill();
      q[0] = q[1];
      q[1] = { x: k, y: n };
    }
    const line = (p) => {
      t = p + (random() * 2 - 1.1) * f;
      return (t > height || t < 0) ? line(p) : t;
    }
    redraw()
    document.documentElement.addEventListener('click', fnTextPopup, false)
    document.documentElement.addEventListener('click', redraw, false)
  }
  componentWillUnmount() {
    // 注销解绑事件
    document.documentElement.removeEventListener('click', fnTextPopup, false)
    document.documentElement.removeEventListener('click', redraw, false)
    
  }
  render() {
    const { Component, pageProps } = this.props
    return (
      
      <Provider store={store}>
        <Layout/>
        <Component {...pageProps} />
      </Provider>
     
      
    )
  }
}

Router.events.on('routeChangeStart', (...args) => {
  NProgress.start();
})

Router.events.on('routeChangeComplete', (...args) => {
  NProgress.done();
})

Router.events.on('routeChangeError', (...args) => {
  NProgress.done();
})