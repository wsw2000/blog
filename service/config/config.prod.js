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

  config.uploadDir = 'app/public/upload';  //上传文件
  return {
    ...config,
    ...userConfig,
  };
};
