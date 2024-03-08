const route = require('express').Router();
const { loginController } = require('../controllers');
const { validateLogin } = require('../middlewares');

route.post('/', validateLogin, loginController.login);

module.exports = route;