const categories = [
  {
    "id": 1,
    "name": "Inovação"
  },
  {
    "id": 2,
    "name": "Escola"
  }
];

const newCategory = {
  "id": 3,
  "name": "xablau"
};

const newCategoryModelSequelize = {
  dataValues: {
    ...newCategory
  }
}

module.exports = {
  categories,
  newCategory,
  newCategoryModelSequelize
};