const validatesCategoryIdsIsNumber = (categoryIds) => categoryIds
  .every((categoryId) => typeof categoryId === 'number');

const validateRequiredFields = (title, content, categoryIds) => title 
  && content && categoryIds && categoryIds.length > 0;

module.exports = (req, res, next) => {
  const { title, content, categoryIds } = req.body;

  if (!validateRequiredFields(title, content, categoryIds)
    || !validatesCategoryIdsIsNumber(categoryIds)) {
    return res.status(400).json({ message: 'Some required fields are missing' });
  }

  next();
};