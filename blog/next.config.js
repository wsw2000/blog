
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const lessToJS = require("less-vars-to-js");


const fs = require('fs');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production'


//主题配置  全局注入
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./styles/modifyVars.less"), "utf8")
);

if (typeof require !== "undefined") {
  require.extensions[".less"] = file => {};
}
module.exports = withLess(
  withCSS({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables,
      localIdentName: "[local]___[hash:base64:5]"
    },
  }),
);
