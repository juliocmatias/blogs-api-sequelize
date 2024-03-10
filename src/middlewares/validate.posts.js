const checkRequiredFields = require('../utils/checkRequiredFields');

module.exports = (req, res, next) => {
  const { title, content, categoryIds } = req.body;
  
  const requiredFields = ['title', 'content'];
  const fields = { title, content };
  
  if (categoryIds && !(Array.isArray(categoryIds) && categoryIds.length > 0)) {
    return res.status(400).json({ message: 'Some required fields are missing' });
  }
  
  const message = checkRequiredFields(fields, requiredFields);

  if (message) return res.status(400).json({ message });

  next();
};