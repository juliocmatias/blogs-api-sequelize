const route = require('express').Router();
const { postsController } = require('../controllers');
const { validateToken, validatePosts } = require('../middlewares');

route.post('/', validateToken, validatePosts, postsController.createPost);

module.exports = route;