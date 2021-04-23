/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  const path = require('path');


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1613014216491_5419';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    myAppName: 'wsw-service',
  };

   // https
  config.cluster = {
    https: {
      key: 'ssl/private.key',
      cert: 'ssl/fullchain.crt',
    },
  };

  config.mysql = {
    // database configuration
    // client: {
    //   host: '120.78.195.82',
    //   port: '3306',
    //   user: 'root',
    //   password: 'wsw666',
    //   database: 'wsw_blog',
    //   // 存储四字节的表情
    //   charset: 'utf8mb4',
    // },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  return {
    ...config,
    ...userConfig,
  };
};
