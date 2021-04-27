/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1613014216491_5419'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }
  config.uploadDir = 'app/public/upload'
  config.mysql = {
    // database configuration
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'wsw_blog_build',
      // 存储四字节的表情
      charset: 'utf8mb4',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  }
  config.uploadDir = 'app/public/upload' // 上传文件

  config.nodemailer = require('nodemailer')
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [
      'http://127.0.0.1:9000',
      'http://127.0.0.1:3000',
      'http://localhost:9000',
      'http://localhost:3000',
      'http://120.78.195.82:3000',
      'http://120.78.195.82',
      'http://www.wsw2000.top:3000',
      'http://www.wsw2000.top',
      'https://120.78.195.82:3000',
      'https://120.78.195.82',
      'https://www.wsw2000.top:3000',
      'https://www.wsw2000.top',
    ],
  }
  config.cors = {
    // origin: ['http://localhost:3000','http://localhost:9001'],   //允许什么域名
    credentials: true, // 允许Cook可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
  config.session = {
    key: 'openId', // 设置session cookie里面的key
    maxAge: 1000 * 60 * 60 * 24 * 2, // 设置过期时间
    httpOnly: true,
    encrypt: true,
    // renew: true         // renew等于true 那么每次刷新页面的时候 session都会被延期
  }
  return {
    ...config,
    ...userConfig,
  }
}
