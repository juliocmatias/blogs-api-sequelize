const { PostCategory } = require('../../models');

module.exports = async (postId, categoryIds, transaction) => {
  const postCategories = categoryIds.map(async (categoryId) => {
    await PostCategory.create({ postId, categoryId }, { transaction });
  });

  await Promise.all(postCategories);
};
