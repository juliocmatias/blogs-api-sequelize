const { Category } = require('../models');
const httpName = require('../utils/httpStatusName');

const createCategory = async (name) => {
  const newCategory = await Category.create({ name });

  return { status: httpName.CREATED, data: newCategory.dataValues };
};

const getAllCategories = async () => {
  const categories = await Category.findAll();

  return { status: httpName.SUCCESSFUL, data: categories };
};

module.exports = {
  createCategory,
  getAllCategories,
};