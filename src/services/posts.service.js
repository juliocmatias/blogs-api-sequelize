const { BlogPost, Category, User } = require('../models');
const httpName = require('../utils/httpStatusName');

// const getPostsByUserId = async (userId) => {
//   const posts = await BlogPost.findAll({
//     where: { userId },
//     include: [
//       { model: User, as: 'user', attributes: { exclude: ['password'] } },
//       { model: Category, as: 'categories', through: { attributes: [] } },
//     ],
//   });
  
//   return { status: httpName.SUCCESSFUL, data: posts };
// };

const getPostById = async (id) => {
  const post = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  if (!post) return { status: httpName.NOT_FOUND, data: { message: 'Post does not exist' } };

  return { status: httpName.SUCCESSFUL, data: post };
};

const updatePost = async (id, title, content, userId) => {
  const post = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  if (!post) return { status: httpName.NOT_FOUND, data: { message: 'Post does not exist' } };
  if (post.userId !== userId) { 
    return { status: httpName.FORBIDDEN, data: { message: 'Unauthorized user' } };
  }
  await BlogPost.update({ title, content }, { where: { id } });

  return { status: httpName.SUCCESSFUL, data: post };
};

module.exports = { getPostById, updatePost };