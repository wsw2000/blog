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

export const timefilter = (value,type) =>{
  let time = new Date(value)
  let year = time.getFullYear()
  let month = (time.getMonth() + 1 + '').padStart(2, '0')
  let date = (time.getDate() + '').padStart(2, '0')

  let hours = (time.getHours() + '').padStart(2, '0')
  let min = (time.getMinutes() + '').padStart(2, '0')
  let sec = (time.getSeconds() + '').padStart(2, '0')

  if(type == 'ymd'){
    return `${year}-${month}-${date} `
  }
  return `${year}-${month}-${date} ${hours}:${min}`
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
export const checkEmail = (email) => {
  let emailTest = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"); 
  return emailTest.test(email)
}

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