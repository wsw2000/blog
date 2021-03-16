'use strict';
module.exports = app => {
  const { router, controller } = app;
  const adminauth = app.middleware.adminauth();
  router.get('/admin/getArticlePie',adminauth,controller.admin.main.getArticlePie);
  router.post('/admin/checkLogin', controller.admin.main.checkLogin);
  router.get('/admin/LoginOut', adminauth, controller.admin.main.LoginOut);
  router.get('/admin/getTypeInfo', adminauth, controller.admin.main.getTypeInfo);
  router.post('/admin/addAcricleType', adminauth, controller.admin.main.addAcricleType);
  router.post('/admin/addArticle', adminauth, controller.admin.main.addArticle);
  router.post('/admin/updateArticle', adminauth, controller.admin.main.updateArticle);
  router.post('/admin/updateArticleType', adminauth, controller.admin.main.updateArticleType);
  router.get('/admin/getArticleList', adminauth, controller.admin.main.getArticleList);
  router.get('/admin/delArticle/:id', adminauth, controller.admin.main.delArticle);
  router.get('/admin/delArticleType/:id', adminauth, controller.admin.main.delArticleType);
  router.get('/admin/getArticleById/:id', adminauth, controller.admin.main.getArticleById);
  router.get('/admin/getListByType/:id', controller.admin.main.getListByType);
  router.post('/admin/saveAvatar', controller.admin.main.saveAvatar);
  
}
;
