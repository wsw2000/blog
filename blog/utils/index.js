import moment from 'moment'

/** 国家公祭日置灰
 * @description: 
 * @param {type} 
 * @return: 
 */
export const memorial = () => {
  let now = moment().locale('zh-cn').format('MM-DD');
  if (
      now === '04-04' || // 清明
      now === '05-12' || // 汶川大地震
      now === '12-13' // 南京大屠杀
  ) {
      document.getElementsByTagName('html')[0].style = 'filter: grayscale(100%);'
  }
}

/** 动态加载js脚本
 * @description: 
 * @param {url} string url
 * @param {callback} fun 回调
 * @return: 
 */
export const loadScript = (url, callback) => {
  // 检测是否加载了 js 文件
  const checkIsLoadScript = (src) => {
    let scriptObjs = document.getElementsByTagName('script');
    for (let sObj of scriptObjs) {
      if (sObj.src == src) {
        return true;
      }
    }
    return false;
  }

  if (checkIsLoadScript(url)) {
    callback();
    return false
  }

  let scriptNode = document.createElement("script");
  scriptNode.setAttribute("type", "text/javascript");
  scriptNode.setAttribute("src", url);
  document.body.appendChild(scriptNode);
  if (scriptNode.readyState) { //IE 判断
    scriptNode.onreadystatechange = () => {
      if (scriptNode.readyState == "complete" || scriptNode.readyState == 'loaded') {
        callback();
      }
    }
  } else {
    scriptNode.onload = () => {
      callback();
    }
  }
}



// 得到一个元素到body的距离
export const getElementToBodyDistance = (element) => {
  let distance = 0
  while (element.offsetParent) {
    distance += element.offsetTop
    element = element.offsetParent
  }
  return distance
}

export const cubic = value => Math.pow(value, 3);
export const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2;

  // 传入元素到body的距离，滚动到该元素的位置
export const scrollToElement = (distance) => {
  const el = document.documentElement
  const beginTime = Date.now()
  const beginValue = el.scrollTop

  const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))

  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 1000
    if (progress < 1) {
      el.scrollTop = beginValue + (distance - beginValue) * easeInOutCubic(progress)
      rAF(frameFunc)
    } else {
      el.scrollTop = distance
    }
  }

  rAF(frameFunc)
}