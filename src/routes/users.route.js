const route = require('express').Router();
const { usersController } = require('../controllers');
const { validateToken } = require('../middlewares');

route.post('/', usersController.create);
route.get('/', validateToken, usersController.getAll);

module.exports = route;