
module.exports= options=>{
  return async function adminauth(ctx,next){
      console.log('openId',ctx.session.openId)
      if(ctx.session.openId){
          await next()
      }else{
          ctx.body={data:'登录失败',code:-1}
      }
  }
}