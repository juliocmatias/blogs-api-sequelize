const { User } = require('../../models');
const httpName = require('../../utils/httpStatusName');

const getAll = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  return { status: httpName.SUCCESSFUL, data: users };
};

module.exports = getAll;