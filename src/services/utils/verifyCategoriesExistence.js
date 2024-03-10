const { Category } = require('../../models');

module.exports = async (categoryIds) => {
  const verify = categoryIds.map(async (categoryId) => {
    const category = await Category.findByPk(categoryId);
    return !!category;
  });
  
  const verifyResults = await Promise.all(verify);

  return verifyResults.every((result) => result === true);
};