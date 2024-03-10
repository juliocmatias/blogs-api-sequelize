const loginService = require('./login.service');
const usersService = require('./users.service');
const categoriesService = require('./categories.service');
const postsService = require('./posts.service');
const posts = require('./posts');

module.exports = {
  loginService,
  usersService,
  categoriesService,
  postsService,
  posts,
};