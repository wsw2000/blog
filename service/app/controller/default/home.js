'use strict';

const Controller = require('egg').Controller;
const querystring = require('querystring')
class HomeController extends Controller {
  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const passWord = this.ctx.request.body.passWord;
    const sql = `SELECT userName FROM admin_user WHERE userName = '${userName}' AND passWord = '${passWord}'`;
    const res = await this.app.mysql.query(sql);
    if (res.length > 0) {
      const openId = new Date().getTime();
      this.ctx.session.openId = openId; // 存入session
      this.ctx.body = { data: '登录成功', openId,code: 1 };
      return;
    }
    this.ctx.body = { data: '登录失败',code: 0 };
  }
  //每日一句
  async getDateMsg() {
    const date = this.ctx.params.date;
    const result = await this.ctx.curl(`http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${date}`,{
      dataType: 'json',
      method: 'GET'
    })
    this.ctx.body = {
      data: result,
    };
  }
  // 总的文章列表
  async getArticleList() {
    const queryObj = this.ctx.query
    const responseObj = { end: false,code:1 };  //判断是否最尾页
    let typeStr =queryObj.typeId == 0 ? '' : `WHERE article.type_id=${queryObj.typeId} `;  
    const orderTypeStr = queryObj.orderType === 'Time' ? 'article.addTime' : 'article.view_count';
    //latest为根据时间排序 否则根据浏览量  DESC从大到小排序   ASC 表示按正序排序(即:从小到大排序)
    const order = queryObj.order === 'DESC' ? 'DESC' : 'ASC'
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
    FROM article LEFT JOIN type ON article.type_id = type.id`;
    const sql_ceshi =
    'SELECT article.id as id,' +
    'article.title as title,' +
    'article.introduce as introduce,' +
    "article.addTime as addTime," +
    'article.view_count as view_count,' +
    'article.content as content,' +
    'article.imgUrl as imgUrl,' +
    'article.isShow as isShow,' +
    'type.typeName as typeName ' +
    'FROM article LEFT JOIN type on article.type_id = type.id ' +
    typeStr + `order by ${orderTypeStr} ${order} limit ${
      (queryObj.page - 1) * queryObj.limit
    }` + ',' + queryObj.limit;   
    // limit5，5，第一个5是起始位置，第二个5是取5行，也就是从第5个开始取，往后取5个，
    console.log(sql_ceshi);
    const results = await this.app.mysql.query(sql_ceshi);
    responseObj.data = results;
    if (results.length !== parseInt(queryObj.limit)) {  //获取到的数据长度不等于limit，则是最后一页
      responseObj.end = true;
    }
    this.ctx.body = responseObj;
  }
  // 添加评论
  async publishComment() {
    const info = this.ctx.request.body;
    const result = await this.app.mysql.insert('guestbook', info);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    };
  }
  // 根据id查询文章详情
  async getActicleById() {
    // 先配置路由的动态传值，然后再接收值
    const id = this.ctx.params.id;
    const result = await this.ctx.service.home.getActicleById(id);
    this.ctx.body = {
      data: result,
    };
  }
  async getGusekList() {
    const result = await this.ctx.service.home.getGusekList();
    if(!result) return
    this.ctx.body = {
      data: result,
      code: 1
    };
  }
  // 文章分类
  async getActicleType() {
    const data = await this.app.mysql.select('type');
    this.ctx.body = { 
      code: 1,
      typedatas: data.filter(item => item.id != -1),
      musicUrl : data.filter(item => item.id == -1),
     };
  }
  // 根据文章分类id查询
  async getListByType() {
    const id = this.ctx.params.id;
    const data = await this.ctx.service.home.getListByType(id);
    this.ctx.body = { data };
  }

  // 获取天气
  async getWeather() {
    const params = {
      key: this.ctx.query.key,
      location: this.ctx.query.location,
      lang: this.ctx.query.lang || 'cn',
    };

    params.key = '984f10091b0d4e64b3c9e724cd422e22';
    // b04947bba8a44ca3ad6f5f5943d69c6a

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 + '').padStart(2, '0');
    const day = (date.getDate() + '').padStart(2, '0');
    const nowDate = year + '' + month + '' + day;
    // this.ctx.curl  请求外部接口
    // 实况天气
    const res1 = await this.ctx.curl('https://devapi.heweather.net/v7/weather/now', {
      dataType: 'json',
      method: 'GET',
      data: params,
    });
    // 逐小时预报（未来24小时）
    const res2 = await this.ctx.curl('https://devapi.heweather.net/v7/weather/24h', {
      dataType: 'json',
      method: 'GET',
      data: params,
    });
    // 7天预报
    const res3 = await this.ctx.curl('https://devapi.heweather.net/v7/weather/7d', {
      dataType: 'json',
      method: 'GET',
      data: params,
    });
    // 日出日落、月升月落和月相
    const res4 = await this.ctx.curl('https://devapi.heweather.net/v7/astronomy/sunmoon', {
      dataType: 'json',
      method: 'GET',
      data: {
        ...params,
        date: nowDate,
      },
    });
    // 分钟级降水
    const res5 = await this.ctx.curl('https://devapi.heweather.net/v7/minutely/5m', {
      dataType: 'json',
      method: 'GET',
      data: params,
    });
    // 灾害预警
    const res6 = await this.ctx.curl('https://devapi.heweather.net/v7/warning/now', {
      dataType: 'json',
      method: 'GET',
      data: params,
    });

    const { now, updateTime } = res1.data;
    const { hourly } = res2.data;
    const { daily } = res3.data;
    const { sunrise, sunset } = res4.data;
    const { summary } = res5.data;
    const { warning } = res6.data;


    const result = {
      now,
      updateTime,
      hourly,
      daily,
      sunmoon: {
        sunrise,
        sunset,
      },
      summary,
      warning,
    };
    this.ctx.body = result;
  }
  // 根据文章id增加访问量
  async postVisits() {
    const id = this.ctx.request.body.id;
    const sql = `UPDATE article set view_count = view_count + 1 where id = ${id}`;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = { isSuccess: result.affectedRows == 1 };
  }
}

module.exports = HomeController;
