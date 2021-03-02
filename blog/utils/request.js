import axios from 'axios'
import QS from 'qs';
axios.defaults.baseURL = 'http://localhost:7001/'
// axios.defaults.baseURL = 'http://www.wsw2000.top:7001/'

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json;charset=UTF-8'
    }
    config.maxContentLength = Infinity
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

const apis = {
  //文章列表
  getArticleList(){
    return new Promise((resolve,reject) =>{
      axios.get(`/api/getArticleList`).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },
  //根据id查询文章详情
  getActicleById(id){
    return new Promise((resolve,reject) =>{
      axios.get(`/api/getActicleById/${id}`).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },
  //获取文章分类
  getActicleType(){
    return new Promise((resolve,reject) =>{
      axios.get(`/api/getActicleType`).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },
  //根据文章分类id查询
  getListByType(id){
    return new Promise((resolve,reject) =>{
      axios.get(`/api/getListByType/${id}`).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },
  getIpWeather() {
    return new Promise((resolve,reject) =>{
      axios.get(`https://ip.help.bj.cn/`).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },
  getWeather(adlng,adlat){
    return new Promise((resolve,reject) =>{
      axios.get(`/api/getWeather`,{
        params:{
          location: `${adlng},${adlat}`,
          lang: "cn",
        }
      }).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  },

  postVisits(data){
    return new Promise((resolve,reject) =>{
      axios.post(`/api/postVisits`,data).then(res =>{
        resolve(res)
      }).catch(e =>{
        reject(e)
      })
    })
  }
}

export default apis;