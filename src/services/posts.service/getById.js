const { BlogPost, User, Category } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getById = async (id) => {
  const post = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  if (!post) return { status: httpName.NOT_FOUND, data: { message: 'Post does not exist' } };

  return { status: httpName.SUCCESSFUL, data: post };
};

module.exports = getById;