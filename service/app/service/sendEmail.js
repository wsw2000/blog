


'use strict';
const Service = require('egg').Service;
class sendService extends Service {
  sendMail(address,name,email,form, subject, html) {
    //下面这几个改成你自己的邮箱、昵称和授权码
    const user = "944627549@QQ.COM";
    const pass = 'kukdtuolfaxqbajd' //授权码在QQ邮箱设置-账号-开启服务：POP3/SMTP服务（详情参考https://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256）
    this.config.nodemailer.createTransport({host: "smtp.qq.com", auth: {user, pass}}).sendMail({
        from: `${name}<${form}>`,//发送者
        to:user,//收件人邮箱，多个邮箱地址间用英文逗号隔开，例如："ATS-L@QQ.COM,ATS-V@QQ.COM"
        subject:`来自${address}的${name}邮箱为${email}来${subject}`,//邮件主题
        html//支持html
        
    }, err => err && console.log("邮件发送失败： ", err));
  }
}

module.exports = sendService;
