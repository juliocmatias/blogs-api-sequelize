const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

const createToken = (payload) => {
  const token = jwt.sign(payload, SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  return token;
};

const verify = (token) => {
  const payload = jwt.verify(token, SECRET);

  return payload;
};

module.exports = {
  createToken,
  verify,
};