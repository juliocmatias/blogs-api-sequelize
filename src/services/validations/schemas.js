const Joi = require('joi');

const userValidate = Joi.object({
  displayName: Joi.string().min(8)
    .message({ 'string.min': '"displayName" length must be at least 8 characters long' }),
  email: Joi.string().email()
    .message({ 'string.email': '"email" must be a valid email' }),
  password: Joi.string().min(6)
    .message({ 'string.min': '"password" length must be at least 6 characters long' }),
});

module.exports = {
  userValidate,
};