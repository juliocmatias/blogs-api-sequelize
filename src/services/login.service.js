const { User } = require('../models');
const httpName = require('../utils/httpStatusName');
const { createToken } = require('../utils/auth');

const login = async (email, password) => {
  const user = await User.findOne({ where: { email, password } });

  if (!user || user.password !== password) {
    return {
      status: httpName.BAD_REQUEST,
      data: {
        message: 'Invalid fields',
      },
    };
  }

  const { password: userPassword, ...userWithoutPassword } = user;

  const token = createToken(userWithoutPassword);

  return { status: httpName.SUCCESSFUL, data: { token } };
};

module.exports = {
  login,
};