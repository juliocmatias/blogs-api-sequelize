const { categoriesService } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: '"name" is required' });
  try {
    const { status, data } = await categoriesService.create(name);
    res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    res.status(mapStatusHTTPS(error.status)).json({ message: error.message });
  }
};

const getAllCategories = async (_req, res) => {
  const { status, data } = await categoriesService.getAll();
  try {
    res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    res.status(mapStatusHTTPS(error.status)).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};