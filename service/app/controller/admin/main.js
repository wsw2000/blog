'use strict';

const Controller = require('egg').Controller;
class MainController extends Controller{

  async checkLogin(){
    let userName = this.ctx.request.body.userName
    let passWord = this.ctx.request.body.passWord
    const sql = `SELECT userName FROM admin_user WHERE userName = '${userName}' AND passWord = '${passWord}'`
    const res = await this.app.mysql.query(sql)
    if(res.length > 0){
      let openId = new Date().getTime()
      this.ctx.session.openId = openId    //存入session
      this.ctx.body = { 'data':'登录成功','openId':openId }
      return
    }
    this.ctx.body = { data :'登录失败' }
  }
  //退出登录
  async LoginOut(){
    this.ctx.session.openId = null 
    this.ctx.body={'data':'退出成功',code:-1}
  }
  async getTypeInfo() {
    const data = await this.app.mysql.select('type')
    this.ctx.body = {data}
  }
  //添加文章类别
  async addAcricleType() {
    let acricleType = this.ctx.request.body
    const result = await this.app.mysql.insert('type',acricleType)
    const insertSuccess = result.affectedRows === 1
    const insertId = result.insertId
    this.ctx.body={
      isScuccess:insertSuccess,
      insertId:insertId
    }
  }
  //根据id删除文章
  async delArticleType(){
    let id = this.ctx.params.id
    const result = await this.app.mysql.delete('type',{id})
    if(result.affectedRows !== 1) return
    this.ctx.body = {code:1}
  }
  //添加文章
  async addArticle() {
    let Articles = this.ctx.request.body
    const result = await this.app.mysql.insert('article',Articles)
    const insertSuccess = result.affectedRows === 1
    const insertId = result.insertId
    this.ctx.body={
      isScuccess:insertSuccess,
      insertId:insertId
    }
  }
  //修改文章
  async updateArticle(){
    let tmpArticle= this.ctx.request.body
    const result = await this.app.mysql.update('article', tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body={
        isScuccess:updateSuccess
    }
  } 
  //更新文章列别
  async updateArticleType(){
    let typeinfo = this.ctx.request.body
    const result = await this.app.mysql.update('type',typeinfo)
    const updateSuccess = result.affectedRows === 1;
    this.ctx.body={
      isScuccess:updateSuccess
    }
  } 
  async getArticlePie(){
    let sql = `SELECT type.id as id,type.typeName as name FROM type ORDER BY type.id ASC`
    const result = await this.app.mysql.query(sql)
    let sql2 = `SELECT  count(*) as total,  
    sum(case when type_id= 1 then 1 else 0 end ) as ${result[0].name},     
    sum(case when type_id=2 then 1 else 0 end ) as ${result[1].name},
    sum(case when type_id=3 then 1 else 0 end ) as ${result[2].name}  FROM article`
    //asc升序
    
    const countList = await this.app.mysql.query(sql2)
    result.forEach(item =>{
      const {name} = item
      item.value = countList[0][name]
    })
    
    this.ctx.body={
      total:countList[0].total,
      countList:result,
      code:1
    }
  }
  //文章列表
  async getArticleList() {
    let sql = `SELECT article.id as id,article.imgUrl as imgUrl,article.title as title,article.content as content,article.introduce as introduce,article.addTime as addTime,type.typeName as typeName FROM article LEFT JOIN type ON article.type_id = type.id ORDER BY article.id DESC
    `
    //asc升序
    const result = await this.app.mysql.query(sql)
    this.ctx.body={
      list:result,
      code:1
    }
  }
  //根据id删除文章
  async delArticle(){
    let id = this.ctx.params.id
    const result = await this.app.mysql.delete('article',{id})
    if(result.affectedRows !== 1) return
    this.ctx.body = {code:1}
  }
  
  //根据文章ID得到文章详情，用于修改文章
  async getArticleById(){
    let id = this.ctx.params.id

    let sql = `SELECT article.id as id,
    article.title as title,
    article.imgUrl as imgUrl,
    article.introduce as introduce,
    article.content as content,
    article.addTime as addTime,
    article.view_count as view_count ,
    type.typeName as typeName, 
    type.id as typeid 
    FROM article LEFT JOIN type ON article.type_id = type.id
    WHERE article.id=${id}`
    const result =await this.app.mysql.query(sql)
    this.ctx.body = { data : result,code : 1}
  }
}


module.exports = MainController