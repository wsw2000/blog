'use strict'
const fs = require('fs')
const pump = require('pump') //pump 压缩 模块

const Controller = require('egg').Controller
class MainController extends Controller {
  async checkLogin() {
    const userName = this.ctx.request.body.userName
    const passWord = this.ctx.request.body.passWord
    const sql = `SELECT userName FROM admin_user WHERE userName = '${userName}' AND passWord = '${passWord}'`
    const res = await this.app.mysql.query(sql)
    if (res.length > 0) {
      const openId = new Date().getTime()
      this.ctx.session.openId = openId // 存入session
      this.ctx.body = { data: '登录成功', openId }
      return
    }
    this.ctx.body = { data: '登录失败' }
  }
  // 退出登录
  async LoginOut() {
    this.ctx.session.openId = null
    this.ctx.body = { data: '退出成功', code: -1 }
  }
  //文章类别
  async getTypeInfo() {
    const data = await this.app.mysql.select('type')
    this.ctx.body = {
      code: 1,
      typedatas: data.filter((item) => item.id != -1),
      musicUrl: data.filter((item) => item.id == -1),
    }
  }
  // 根据文章分类id查询
  async getListByType() {
    const id = this.ctx.params.id
    const data = await this.ctx.service.home.getListByType(id)
    this.ctx.body = { data }
  }
  // 添加文章类别
  async addAcricleType() {
    const acricleType = this.ctx.request.body
    const result = await this.app.mysql.insert('type', acricleType)
    const insertSuccess = result.affectedRows === 1
    const insertId = result.insertId
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    }
  }
  // 根据id删除文章
  async delArticleType() {
    const id = this.ctx.params.id
    const result = await this.app.mysql.delete('type', { id })
    if (result.affectedRows !== 1) return
    this.ctx.body = { code: 1 }
  }
  // 添加文章
  async addArticle() {
    const Articles = this.ctx.request.body
    const result = await this.app.mysql.insert('article', Articles)
    const insertSuccess = result.affectedRows === 1
    const insertId = result.insertId
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    }
  }
  // 修改文章
  async updateArticle() {
    const tmpArticle = this.ctx.request.body
    const result = await this.app.mysql.update('article', tmpArticle)
    const updateSuccess = result.affectedRows === 1
    this.ctx.body = {
      isScuccess: updateSuccess,
    }
  }
  // 更新文章类别
  async updateArticleType() {
    const typeinfo = this.ctx.request.body
    const result = await this.app.mysql.update('type', typeinfo)
    const updateSuccess = result.affectedRows === 1
    this.ctx.body = {
      isScuccess: updateSuccess,
    }
  }
  async getArticlePie() {
    const sql =
      'SELECT type.id as id,type.typeName as name FROM type ORDER BY type.id ASC'
    const result = await this.app.mysql.query(sql)
    const sql2 = `SELECT  count(*) as total,  
    sum(case when type_id= 1 then 1 else 0 end ) as ${result[1].name},     
    sum(case when type_id=2 then 1 else 0 end ) as ${result[2].name},
    sum(case when type_id=3 then 1 else 0 end ) as ${result[3].name}  FROM article`
    // asc升序

    const countList = await this.app.mysql.query(sql2)
    const result1 = result.filter((item) => item.id != -1)
    result1.forEach((item) => {
      const { name } = item
      item.value = countList[0][name]
    })

    this.ctx.body = {
      total: countList[0].total,
      countList: result1,
      code: 1,
    }
  }
  // // 文章列表
  // async getArticleList() {
  //   const sql = `SELECT article.id as id,article.imgUrl as imgUrl,article.isShow as isShow,article.title as title,article.content as content,article.introduce as introduce,article.addTime as addTime,type.typeName as typeName FROM article LEFT JOIN type ON article.type_id = type.id ORDER BY article.id DESC
  //   `;
  //   // asc升序
  //   const result = await this.app.mysql.query(sql);
  //   this.ctx.body = {
  //     list: result,
  //     code: 1,
  //   };
  // }
  // 总的文章列表
  async getArticleList() {
    const queryObj = this.ctx.request.body
    const responseObj = { end: false, code: 1 } //判断是否最尾页
    let typeStr =
      queryObj.typeId == 0 ? '' : `WHERE article.type_id=${queryObj.typeId} `

    const orderTypeStr =
      queryObj.orderType === 'Time' ? 'article.addTime' : 'article.view_count'
    //latest为根据时间排序 否则根据浏览量  DESC从大到小排序   ASC 表示按正序排序(即:从小到大排序)
    const order = queryObj.order === 'DESC' ? 'DESC' : 'ASC'
    const sql =
      'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.addTime as addTime,' +
      'article.view_count as view_count,' +
      'article.content as content,' +
      'article.imgUrl as imgUrl,' +
      'article.isShow as isShow,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type on article.type_id = type.id ' +
      typeStr +
      `order by ${orderTypeStr} ${order} limit ${
        (queryObj.page - 1) * queryObj.limit
      }` +
      ',' +
      queryObj.limit
    // limit5，5，第一个5是起始位置，第二个5是取5行，也就是从第5个开始取，往后取5个，
    const list = await this.ctx.service.home.getListByType(queryObj.typeId)
    responseObj.total =
      queryObj.typeId == 0
        ? (await this.app.mysql.select('article')).length
        : list.length
    const results = await this.app.mysql.query(sql)
    responseObj.data = results
    if (results.length !== parseInt(queryObj.limit)) {
      //获取到的数据长度不等于limit，则是最后一页
      responseObj.end = true
    }
    this.ctx.body = responseObj
  }
  // 根据id删除文章
  async delArticle() {
    const id = this.ctx.params.id
    const result = await this.app.mysql.delete('article', { id })
    if (result.affectedRows !== 1) return
    this.ctx.body = { code: 1 }
  }

  // 根据文章ID得到文章详情，用于修改文章
  async getArticleById() {
    const id = this.ctx.params.id

    const sql = `SELECT article.id as id,
    article.title as title,
    article.imgUrl as imgUrl,
    article.isShow as isShow,
    article.introduce as introduce,
    article.content as content,
    article.addTime as addTime,
    article.view_count as view_count ,
    type.typeName as typeName, 
    type.id as typeid 
    FROM article LEFT JOIN type ON article.type_id = type.id
    WHERE article.id=${id}`
    const result = await this.app.mysql.query(sql)
    this.ctx.body = { data: result, code: 1 }
  }
  // 保存头像/封面
  async saveAvatar() {
    const { ctx } = this
    // 解析表单数据的方法
    const parts = ctx.multipart({ autoFields: true }) // 获取同时上传的多个文件，
    let files = {}
    let stream
    while ((stream = await parts()) != null) {
      //// 获取文件的信息 != null
      //stream.filename 上传图片的名字
      if (!stream.filename) {
        break
      }
      const fieldname = stream.fieldname // file表单上传图片的名字
      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename)
      const target = dir.uploadDir
      const writeStream = fs.createWriteStream(target)

      await pump(stream, writeStream)

      files = Object.assign(files, {
        //复制对象
        [fieldname]: dir.saveDir, // avatar: "http://localhost:7001/public/...."
      })
    }
    //Object.keys(files)返回对象中每一项key的数组
    if (Object.keys(files).length > 0) {
      ctx.body = {
        code: 200,
        message: '图片上传成功',
        data: files,
      }
    } else {
      ctx.body = {
        code: 500,
        message: '图片上传失败',
        data: {},
      }
    }
  }
}

module.exports = MainController
