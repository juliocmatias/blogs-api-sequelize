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

const postsUserId1 = [
  {
    "id": 1,
    "title": "Post do Ano",
    "content": "Melhor post do ano",
    "userId": 1,
    "published": "2011-08-01T19:58:00.000Z",
    "updated": "2011-08-01T19:58:51.000Z",
    "user": {
      "id": 1,
      "displayName": "Lewis Hamilton",
      "email": "lewishamilton@gmail.com",
      "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    "categories": [
      {
        "id": 1,
        "name": "Inovação"
      }
    ]
  },
  {
    "id": 2,
    "title": "Vamos que vamos",
    "content": "Foguete não tem ré",
    "userId": 1,
    "published": "2011-08-01T19:58:00.000Z",
    "updated": "2011-08-01T19:58:51.000Z",
    "user": {
      "id": 1,
      "displayName": "Lewis Hamilton",
      "email": "lewishamilton@gmail.com",
      "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    "categories": [
      {
        "id": 2,
        "name": "Escola"
      }
    ]
  },
  {
    "id": 3,
    "title": "Fórmula 1",
    "content": "O campeão do ano!",
    "userId": 1,
    "published": "2024-04-26T14:52:30.000Z",
    "updated": "2024-04-26T14:52:30.000Z",
    "user": {
      "id": 1,
      "displayName": "Lewis Hamilton",
      "email": "lewishamilton@gmail.com",
      "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
    },
    "categories": [
      {
        "id": 1,
        "name": "Inovação"
      }
    ]
  }
];


const bodyPostUpdate = {
  title: 'title updated', 
  content: 'content updated'
}

const findPostUpdated =   {
  "id": 1,
  "title": bodyPostUpdate.title,
  "content": bodyPostUpdate.content,
  "userId": 1,
  "published": "2011-08-01T19:58:00.000Z",
  "updated": "2011-08-01T19:58:51.000Z",
  "user": {
    "id": 1,
    "displayName": "Lewis Hamilton",
    "email": "lewishamilton@gmail.com",
    "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg"
  },
  "categories": [
    {
      "id": 1,
      "name": "Inovação"
    }
  ]
}


module.exports = {
  postBody,
  postCreated,
  blobPostModelSequelize,
  postCategoryModelSequelize,
  postFindModelSequelize,
  postsUserId1,
  bodyPostUpdate,
  findPostUpdated
};