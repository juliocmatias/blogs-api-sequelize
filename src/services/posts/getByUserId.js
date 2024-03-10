const { BlogPost, User, Category } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getByUserId = async (userId) => {
  const posts = await BlogPost.findAll({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  
  return { status: httpName.SUCCESSFUL, data: posts };
};

module.exports = getByUserId;