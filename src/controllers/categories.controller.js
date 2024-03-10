const { categoriesService } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: '"name" is required' });

  const { status, data } = await categoriesService.create(name);

  return res.status(mapStatusHTTPS(status)).json(data);
};

const getAllCategories = async (_req, res) => {
  const { status, data } = await categoriesService.getAll();

  return res.status(mapStatusHTTPS(status)).json(data);
};

module.exports = {
  createCategory,
  getAllCategories,
};