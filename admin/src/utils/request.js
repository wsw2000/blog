

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:7001/admin'
// axios.defaults.baseURL = 'https://wsw2000.top:7001/admin'


axios.defaults.withCredentials=true


//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json;charset=UTF-8'
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response.data.data);
    // if(response.data.data === '登录失败'){
    //   window.location = '/login'
    // }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

const apis = {
  baseURL : 'http://localhost:7001/admin',
  // baseURL : 'https://wsw2000.top:7001/admin',

  loginAdmin(data){
    return new Promise((resolve,reject) =>{
      axios({
        method:'post',
        url:'/checkLogin',
        data,
        withCredentials: true
      }).then(res =>{
        resolve(res)
      })
    })
  },
  LoginOut(){
    return new Promise((resolve,reject) =>{
      axios({url:`/LoginOut`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  getTypeInfo(){
    return new Promise((resolve,reject) =>{
      axios({url:`/getTypeInfo`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  getListByType(id){
    return new Promise((resolve,reject) =>{
      axios({url:`/getListByType/${id}`}).then(res =>{
        resolve(res)
      })
    })
  },
  addArticle(data){
    return new Promise((resolve,reject) =>{
      axios({
        method:'post',
        url:'/addArticle',
        // header:{ 'Access-Control-Allow-Origin':'*' },
        data,
        withCredentials: true
      }).then(res =>{
        resolve(res)
      })
    })
  },
  addAcricleType(data){
    console.log(data);
    return new Promise((resolve,reject) =>{
      axios({
        method:'post',
        url:'/addAcricleType',
        data,
        withCredentials: true
      }).then(res =>{
        resolve(res)
      })
    })
  },
  updateArticleType(data){
    return new Promise((resolve,reject) =>{
      axios({
        method:'post',
        url:'/updateArticleType',
        data,
        withCredentials: true
      }).then(res =>{
        resolve(res)
      })
    })
  },
  updateArticle(data){
    return new Promise((resolve,reject) =>{
      axios({
        method:'post',
        url:'/updateArticle',
        header:{ 'Access-Control-Allow-Origin':'*' },
        data,
        withCredentials: true
      }).then(res =>{
        resolve(res)
      })
    })
  },
  getArticlePie(){
    return new Promise((resolve,reject) =>{
      axios({url:`/getArticlePie`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  getArticleList(){
    return new Promise((resolve,reject) =>{
      axios({url:`/getArticleList`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  delArticleType(id){
    return new Promise((resolve,reject) =>{
      axios({url:`/delArticleType/${id}`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  delArticle(id){
    return new Promise((resolve,reject) =>{
      axios({url:`/delArticle/${id}`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  },
  getArticleById(id) { 
    return new Promise((resolve,reject) =>{
      axios({url:`/getArticleById/${id}`,withCredentials:true}).then(res =>{
        resolve(res)
      })
    })
  }
}

export default apis