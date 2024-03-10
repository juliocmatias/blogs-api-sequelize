const validateLogin = require('./validate.login');
const validateToken = require('./auth');
const validatePosts = require('./validate.posts');

module.exports = {
  validateLogin,
  validateToken,
  validatePosts,
};