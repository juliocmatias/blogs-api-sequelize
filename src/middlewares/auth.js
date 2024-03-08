const { verify } = require('../utils/auth');

// middleware de verificação de autenticação de Token
const extractBearerToken = (token) => token.split(' ')[1];

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const payload = verify(extractBearerToken(token));
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};