const { verify } = require('../utils/auth');

// middleware de verificação de autenticação de Token

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const user = verify(token);
    req.Bearer = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};