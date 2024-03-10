const { User } = require('../../models');
const httpName = require('../../utils/httpStatusName');
const { createToken } = require('../../utils/auth');
const { userValidate } = require('../validations/schemas');

const findUserByEmail = async (email) => {
  const userExists = await User.findOne({ where: { email } });

  return userExists;
};

const create = async (user) => {
  const { displayName, email, password, image } = user;

  const { error } = userValidate.validate({ displayName, email, password });

  if (error) return { status: httpName.BAD_REQUEST, data: { message: error.message } }; 

  if (await findUserByEmail(email)) {
    return { 
      status: httpName.CONFLICT, data: { message: 'User already registered' } }; 
  }

  const newUser = await User.create({ displayName, email, password, image });

  const { password: userPassword, ...userWithoutPassword } = newUser.dataValues;

  const token = createToken(userWithoutPassword);

  return { status: httpName.CREATED, data: { token } };
};

module.exports = create;
