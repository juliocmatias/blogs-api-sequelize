const { BlogPost, PostCategory, Category, sequelize } = require('../models');
const httpName = require('../utils/httpStatusName');

// a createPost é uma função que cria um post no banco de dados.
// Ela recebe um título (title), um conteúdo (content) e uma lista de ids de categorias (categoryIds).
// Ela deve retornar um objeto com a chave status e a chave data.

const verifyCategoriesExistence = async (categoryIds) => {
  const verify = categoryIds.map(async (categoryId) => {
    const category = await Category.findByPk(categoryId);
    return !!category;
  });
  
  const verifyResults = await Promise.all(verify);

  return verifyResults.every((result) => result === true);
};

const createPostCategories = async (postId, categoryIds, transaction) => {
  const postCategories = categoryIds.map(async (categoryId) => {
    await PostCategory.create({ postId, categoryId }, { transaction });
  });

  await Promise.all(postCategories);
};

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

module.exports = {
  createPost,
};