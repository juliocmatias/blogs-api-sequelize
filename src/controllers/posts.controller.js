const { postsService, posts } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const createPost = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { id } = req.user;

  const { status, data } = await posts.createPost(title, content, id, categoryIds);

  return res.status(mapStatusHTTPS(status)).json(data);
};

const getPostsByUserId = async (req, res) => {
  const { id } = req.user;

  const { status, data } = await posts.getByUserId(id);

  return res.status(mapStatusHTTPS(status)).json(data);
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await postsService.getPostById(id);

  return res.status(mapStatusHTTPS(status)).json(data);
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
};