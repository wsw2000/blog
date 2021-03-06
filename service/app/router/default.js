'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/getArticleList', controller.default.home.getArticleList);
  router.get('/api/getActicleById/:id', controller.default.home.getActicleById);
  router.get('/api/getActicleType', controller.default.home.getActicleType);
  router.get('/api/getListByType/:id', controller.default.home.getListByType);
  router.get('/api/getWeather/', controller.default.home.getWeather);
  router.post('/api/postVisits/', controller.default.home.postVisits);
  router.post('/api/publishComment/', controller.default.home.publishComment);
  router.post('/api/checkLogin/', controller.default.home.checkLogin);
  router.get('/api/getGusekList/', controller.default.home.getGusekList);
};
