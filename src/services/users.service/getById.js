const { User } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

  if (!user) return { status: httpName.NOT_FOUND, data: { message: 'User does not exist' } };

  return { status: httpName.SUCCESSFUL, data: user };
};

module.exports = getById;