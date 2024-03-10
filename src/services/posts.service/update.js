const { BlogPost, User, Category } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const update = async (id, title, content, userId) => {
  const post = await BlogPost.findByPk(id);

  if (!post) return { status: httpName.NOT_FOUND, data: { message: 'Post does not exist' } };

  if (post.userId !== userId) { 
    return { status: httpName.UNAUTHORIZED, data: { message: 'Unauthorized user' } };
  }
  await BlogPost.update({ title, content }, { where: { id } });

  const postUpdated = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  return { status: httpName.SUCCESSFUL, data: postUpdated };
};

module.exports = update;