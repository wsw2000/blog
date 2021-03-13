"use strict";
const fs = require("fs");
const pump = require("pump");  //pump 压缩 模块

const Controller = require("egg").Controller;
class MainController extends Controller {
  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const passWord = this.ctx.request.body.passWord;
    const sql = `SELECT userName FROM admin_user WHERE userName = '${userName}' AND passWord = '${passWord}'`;
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      const openId = new Date().getTime();
      this.ctx.session.openId = openId; // 存入session
      this.ctx.body = { data: "登录成功", openId };
      return;
    }
    this.ctx.body = { data: "登录失败" };
  }
  // 退出登录
  async LoginOut() {
    this.ctx.session.openId = null;
    this.ctx.body = { data: "退出成功", code: -1 };
  }
  async getTypeInfo() {
    const data = await this.app.mysql.select("type");
    this.ctx.body = { data };
  }
  // 添加文章类别
  async addAcricleType() {
    const acricleType = this.ctx.request.body;
    const result = await this.app.mysql.insert("type", acricleType);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    };
  }
  // 根据id删除文章
  async delArticleType() {
    const id = this.ctx.params.id;
    const result = await this.app.mysql.delete("type", { id });
    if (result.affectedRows !== 1) return;
    this.ctx.body = { code: 1 };
  }
  // 添加文章
  async addArticle() {
    const Articles = this.ctx.request.body;
    const result = await this.app.mysql.insert("article", Articles);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    };
  }
  // 修改文章
  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.update("article", tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body = {
      isScuccess: updateSuccess,
    };
  }
  // 更新文章类别
  async updateArticleType() {
    const typeinfo = this.ctx.request.body;
    const result = await this.app.mysql.update("type", typeinfo);
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body = {
      isScuccess: updateSuccess,
    };
  }
  async getArticlePie() {
    const sql =
      "SELECT type.id as id,type.typeName as name FROM type ORDER BY type.id ASC";
    const result = await this.app.mysql.query(sql);
    const sql2 = `SELECT  count(*) as total,  
    sum(case when type_id= 1 then 1 else 0 end ) as ${result[0].name},     
    sum(case when type_id=2 then 1 else 0 end ) as ${result[1].name},
    sum(case when type_id=3 then 1 else 0 end ) as ${result[2].name}  FROM article`;
    // asc升序

    const countList = await this.app.mysql.query(sql2);
    result.forEach((item) => {
      const { name } = item;
      item.value = countList[0][name];
    });

    this.ctx.body = {
      total: countList[0].total,
      countList: result,
      code: 1,
    };
  }
  // 文章列表
  async getArticleList() {
    const sql = `SELECT article.id as id,article.imgUrl as imgUrl,article.title as title,article.content as content,article.introduce as introduce,article.addTime as addTime,type.typeName as typeName FROM article LEFT JOIN type ON article.type_id = type.id ORDER BY article.id DESC
    `;
    // asc升序
    const result = await this.app.mysql.query(sql);
    this.ctx.body = {
      list: result,
      code: 1,
    };
  }
  // 根据id删除文章
  async delArticle() {
    const id = this.ctx.params.id;
    const result = await this.app.mysql.delete("article", { id });
    if (result.affectedRows !== 1) return;
    this.ctx.body = { code: 1 };
  }

  // 根据文章ID得到文章详情，用于修改文章
  async getArticleById() {
    const id = this.ctx.params.id;

    const sql = `SELECT article.id as id,
    article.title as title,
    article.imgUrl as imgUrl,
    article.introduce as introduce,
    article.content as content,
    article.addTime as addTime,
    article.view_count as view_count ,
    type.typeName as typeName, 
    type.id as typeid 
    FROM article LEFT JOIN type ON article.type_id = type.id
    WHERE article.id=${id}`;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { data: result, code: 1 };
  }
  // 保存头像/封面
  async saveAvatar() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字
      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }

    if (Object.keys(files).length > 0) {
      ctx.body = {
        code: 200,
        message: "图片上传成功",
        data: files,
      };
    } else {
      ctx.body = {
        code: 500,
        message: "图片上传失败",
        data: {},
      };
    }
  }
}

module.exports = MainController;
