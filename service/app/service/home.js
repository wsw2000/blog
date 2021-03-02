'use strict';
const Service = require('egg').Service;
class HomeService extends Service {
  async getActicleById(id){
    let sql = `SELECT article.id as id,article.title as title,article.imgUrl as imgUrl,article.introduce as introduce,article.content as content,article.addTime as addTime,article.view_count as view_count ,type.typeName as typeName, type.id as typeid FROM article LEFT JOIN type ON article.type_id = type.id WHERE article.id=${id}`
    const result = await this.app.mysql.query(sql)
    let comments_sql = `SELECT id,comment_id,is_reply,article_id, unamed, email, content,     addTime,address,to_unamed from guestbook WHERE article_id = ${id}`  
    const comments = await this.app.mysql.query(comments_sql)  //总评论
    const comments_list = comments.filter(item => item.comment_id != 0)  //评论
    const reply_list = comments.filter(item => item.is_reply != 0)  //回复

    //过滤出每条评论的恢复列表
    const fliterReply = (id) =>{
      return reply_list.filter(item =>item.is_reply == id)
    }
    comments_list.forEach(item => {
      item.replyLists = fliterReply(item.comment_id)
    })
    
    result[0].comments_list = comments_list

    return result
  }
  //根据文章id查找文章list
  async getListByType(uid) {
    let sql = `SELECT article.id as id,
    article.title as title,
    article.introduce as introduce,
    article.content as content,
    article.addTime as addTime,
    article.imgUrl as imgUrl,
    article.view_count as view_count ,
    type.typeName as typeName, 
    type.id as type_id 
    FROM article LEFT JOIN type ON article.type_id = type.id
    WHERE article.type_id=${uid}`
    const data = await this.app.mysql.query(sql);
    return data;
  }
}
module.exports = HomeService;