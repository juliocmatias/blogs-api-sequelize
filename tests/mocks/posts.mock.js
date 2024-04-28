const postBody = {
  "title": "Fórmula 1",
  "content": "O campeão do ano!",
  "categoryIds": [1]
}


const postCreated = {
  "id": 3,
  "title": "Fórmula 1",
  "content": "O campeão do ano!",
  "userId": 1,
  "published": "2024-04-26T14:52:30.000Z",
  "updated": "2024-04-26T14:52:30.000Z"
}
const blobPostModelSequelize = {
  dataValues: {
    ...postCreated
  },
  ...postCreated
};

const postCategoryModelSequelize = {
  affectedRows: 1
};

const postFindModelSequelize = {
  dataValues: {
    ...postCreated
  },
  ...postCreated
};


module.exports = {
  postBody,
  postCreated,
  blobPostModelSequelize,
  postCategoryModelSequelize,
  postFindModelSequelize
};