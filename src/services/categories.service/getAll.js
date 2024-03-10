const { Category } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getAll = async () => {
  const categories = await Category.findAll();

  return { status: httpName.SUCCESSFUL, data: categories };
};

module.exports = getAll;