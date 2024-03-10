const { BlogPost, Category, User, sequelize } = require('../models');
const httpName = require('../utils/httpStatusName');
const verifyCategoriesExistence = require('./utils/verifyCategoriesExistence');
const createPostCategories = require('./utils/createPostCategories');

const createPost = async (title, content, userId, categoryIds) => {
  if (!await verifyCategoriesExistence(categoryIds)) {
    return { status: httpName.BAD_REQUEST, 
      data: { message: 'one or more "categoryIds" not found' } };
  }
  try {
    const postId = await sequelize.transaction(async (t) => {
      const { id } = await BlogPost.create(
        { title, content, userId }, 
        { transaction: t },
      );
      await createPostCategories(id, categoryIds, t);
      return id;
    });
    
    const postCreated = await BlogPost.findByPk(postId);

    return { status: httpName.CREATED, data: postCreated.dataValues };
  } catch (err) {
    return { status: httpName.INTERNAL_SERVER_ERROR, message: err.message };
  }
};

const getPostsByUserId = async (userId) => {
  const posts = await BlogPost.findAll({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  
  return { status: httpName.SUCCESSFUL, data: posts };
};

module.exports = { createPost, getPostsByUserId };