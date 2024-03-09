const { Category } = require('../models');
const httpName = require('../utils/httpStatusName');

const createCategory = async (name) => {
  const newCategory = await Category.create({ name });

  return { status: httpName.CREATED, data: newCategory.dataValues };
};

module.exports = {
  createCategory,
};