'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  //总的文章列表 
  async getArticleList() {
    // "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime,"+
    let sql = `SELECT article.id as id,
    article.title as title,
    article.imgUrl as imgUrl,
    article.introduce as introduce,
    article.content as content,
    article.addTime as addTime,
    article.view_count as view_count ,
    type.typeName as typeName, 
    type.id as typeid 
    FROM article LEFT JOIN type ON article.type_id = type.id`
    let sql1 = `select * from article`
    const results = await this.app.mysql.query(sql)
    this.ctx.body = {
      data:results,
      code:0
    }
  }
  //根据id查询文章详情
  async getActicleById(){
    //先配置路由的动态传值，然后再接收值
    let id = this.ctx.params.id
    const result = await this.ctx.service.home.getActicleById(id)
    this.ctx.body = {
      data : result
    }
  }
  //文章分类
  async getActicleType(){
    const data =await this.app.mysql.select('type')
    this.ctx.body = {data}
  }
  //根据文章分类id查询
  async getListByType(){
    let id = this.ctx.params.id
    const data =await this.ctx.service.home.getListByType(id) 
    this.ctx.body = {data}
  }

   // 获取天气
   async getWeather() {
    const params = {
      key: this.ctx.query.key,
      location: this.ctx.query.location,
      lang: this.ctx.query.lang || 'cn'
    }

    params.key = '984f10091b0d4e64b3c9e724cd422e22'
    // b04947bba8a44ca3ad6f5f5943d69c6a

    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 + '').padStart(2,'0');
    let day = (date.getDate() + '').padStart(2,'0');
    const nowDate = year + "" + month + "" + day;
    //this.ctx.curl  请求外部接口
    //实况天气
    const res1 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/now`, {
      dataType: 'json',
      method: 'GET',
      data: params
    })
    //逐小时预报（未来24小时）
    const res2 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/24h`, {
      dataType: 'json',
      method: 'GET',
      data: params
    })
    //7天预报 
    const res3 = await this.ctx.curl(`https://devapi.heweather.net/v7/weather/7d`, {
      dataType: 'json',
      method: 'GET',
      data: params
    })
    //日出日落、月升月落和月相
    const res4 = await this.ctx.curl(`https://devapi.heweather.net/v7/astronomy/sunmoon`, {
      dataType: 'json',
      method: 'GET',
      data: {
        ...params,
        date: nowDate
      }
    })
    //分钟级降水 
    const res5 = await this.ctx.curl(`https://devapi.heweather.net/v7/minutely/5m`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    })
    //灾害预警
    const res6 = await this.ctx.curl(`https://devapi.heweather.net/v7/warning/now`, {
      dataType: 'json',
      method: 'GET',
      data: params,
    })

    let { now, updateTime } = res1.data;
    let { hourly } = res2.data;
    let { daily } = res3.data;
    let { sunrise, sunset } = res4.data;
    let { summary } = res5.data;
    let { warning } = res6.data;


    const result = {
      now,
      updateTime,
      hourly,
      daily,
      sunmoon: {
        sunrise,
        sunset
      },
      summary,
      warning
    }
    this.ctx.body = result
  }
  //根据文章id增加访问量
  async postVisits(){
    console.log( '-------------------------');

    console.log( this.ctx.request.body);
    let id = this.ctx.request.body.id
    let sql = `UPDATE article set view_count = view_count + 1 where id = ${id}`
    const result =await this.app.mysql.query(sql)
    this.ctx.body = {isSuccess:result.affectedRows == 1}
  }
}

module.exports = HomeController;
