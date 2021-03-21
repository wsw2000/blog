'use strict';
 
const Service = require('egg').Service;
const path = require("path");
const sd = require('silly-datetime');   //时间处理 
const mkdirp = require('mkdirp'); // 递归创建目录。
 
class ToolsService extends Service {
  /**
   * 获取文件上传目录
   * @param {*} filename
   */
  async getUploadFile(filename) {
    console.log('filename',filename);
    // 1.获取当前日期
    let day = sd.format(new Date(), 'YYYYMMDD');
    // 2.创建图片保存的路径
    let dir = path.join(this.config.uploadDir, day);
    // app\public\upload\20210318
    await mkdirp(dir); // 不存在就创建目录
    let date = Date.now(); // 毫秒数
    // 返回图片保存的路径
    let uploadDir = path.join(dir, date + path.extname(filename));
    //'index.html' '.html'  'index.' '.' 'index' ''
    return {
      uploadDir,
       //uploadDir app\public\upload\20210318\1616076565830.png
      saveDir: this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/')
      //saveDir http://localhost:7001/public/upload/20210318/1616077751382.png
    }
  }
}
 
module.exports = ToolsService;