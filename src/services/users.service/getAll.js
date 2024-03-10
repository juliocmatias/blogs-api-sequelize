const { User } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getAll = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  if (!users) return { status: httpName.NOT_FOUND, data: { message: 'Users not found' } };

  return { status: httpName.SUCCESSFUL, data: users };
};

module.exports = getAll;