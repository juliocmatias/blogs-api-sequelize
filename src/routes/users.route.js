const route = require('express').Router();
const { usersController } = require('../controllers');

route.post('/', usersController.create);

module.exports = route;