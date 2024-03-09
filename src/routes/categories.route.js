const route = require('express').Router();
const { categoriesController } = require('../controllers');
const { validateToken } = require('../middlewares');

route.post('/', validateToken, categoriesController.createCategory);
route.get('/', validateToken, categoriesController.getAllCategories);

module.exports = route;