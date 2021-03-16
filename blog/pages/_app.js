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

    var canvas = document.createElement('canvas') || null
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

    //粒子
    var canvas = document.getElementById("cas");
    var ctx = canvas.getContext("2d");
    resize();
    window.onresize = resize;
  
    function resize() {
      canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
  
    var RAF = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 20);
          };
    })();
  
    // 鼠标活动时，获取鼠标坐标
    var warea = {x: null, y: null, max: 20000};
    window.onmousemove = function(e) {
      e = e || window.event;
  
      warea.x = e.clientX;
      warea.y = e.clientY;
    };
    window.onmouseout = function(e) {
      warea.x = null;
      warea.y = null;
    };
  
    // 添加粒子
    // x，y为粒子坐标，xa, ya为粒子xy轴加速度，max为连线的最大距离
    var dots = [];
    for (var i = 0; i < 120; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var xa = Math.random() * 2 - 1;
      var ya = Math.random() * 2 - 1;
  
      dots.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: 6000
      })
    }
  
    // 延迟100秒开始执行动画，如果立即执行有时位置计算会出错
    setTimeout(function() {
      animate();
    }, 1000);
  
    // 每一帧循环的逻辑
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // 将鼠标坐标添加进去，产生一个用于比对距离的点数组
      var ndots = [warea].concat(dots);
  
      dots.forEach(function(dot) {
  
        // 粒子位移
        dot.x += dot.xa;
        dot.y += dot.ya;
  
        // 遇到边界将加速度反向
        dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1;
        dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1;
  
        // 绘制点
        ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);
  
        // 循环比对粒子间的距离
        for (var i = 0; i < ndots.length; i++) {
          var d2 = ndots[i];
  
          if (dot === d2 || d2.x === null || d2.y === null) continue;
  
          var xc = dot.x - d2.x;
          var yc = dot.y - d2.y;
  
          // 两个粒子之间的距离
          var dis = xc * xc + yc * yc + xc * yc;
  
          // 距离比
          var ratio;
  
          // 如果两个粒子之间的距离小于粒子对象的max值，则在两个粒子间画线
          if (dis < d2.max) {
  
            // 如果是鼠标，则让粒子向鼠标的位置移动
            if (d2 === warea && dis > (d2.max / 2)) {
              dot.x -= xc * 0.03;
              dot.y -= yc * 0.03;
            }
  
            // 计算距离比
            ratio = (d2.max - dis) / d2.max;
  
            // 画线
            ctx.beginPath();
            ctx.lineWidth = ratio / 2;
            ctx.strokeStyle = '#693c72';
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
  
        // 将已经计算过的粒子从数组中删除
        ndots.splice(ndots.indexOf(dot), 1);
      });
  
      RAF(animate);
    }
    document.documentElement.addEventListener('click', fnTextPopup, false)
    document.documentElement.addEventListener('click', redraw, false)
  }
  componentWillUnmount() {
    // 注销解绑事件
    // document.documentElement.removeEventListener('click', fnTextPopup, false)
    // document.documentElement.removeEventListener('click', redraw, false)
    
  }
  render() {
    const { Component, pageProps } = this.props
    return (
      
      <Provider store={store}>
        <Layout/>
        <canvas id="cas" className="lizicanvas"></canvas>
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