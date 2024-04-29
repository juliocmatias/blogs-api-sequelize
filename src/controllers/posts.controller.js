const { postsService } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const createPost = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { id } = req.user;
  try {
    const { status, data } = await postsService.createPost(title, content, id, categoryIds);
    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

const getPostsByUserId = async (req, res) => {
  const { id } = req.user;
  try {
    const { status, data } = await postsService.getByUserId(id);
    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const { status, data } = await postsService.getById(id);
    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const { status, data } = await postsService.update(id, title, content, userId);
    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createPost,
  getPostsByUserId,
  getPostById,
  updatePost,
};