const route = require('express').Router();
const { categoriesController } = require('../controllers');
const { validateToken } = require('../middlewares');

route.post('/', validateToken, categoriesController.createCategory);

module.exports = route;