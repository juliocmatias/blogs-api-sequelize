const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');
const validationErrorServer = require('./ValidationErroServer.test');
const validationItToken = require('./ValidationItToken.test');
const { BlogPost, User, sequelize, PostCategory, Category } = require('../../src/models');
const { userMock, postsMock, categoriesMock } = require('../mocks');


const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('Posts test', function () {
  let tokenRequest = '';

  beforeEach(async function () { 
    sinon.restore();
    // arrange
    sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);

    const bodyRequest = { email: userMock.userId1.email, password: userMock.userId1.password };

    const { body: { token } } = await chai.request(app).post('/login').send(bodyRequest);
    
    tokenRequest = token;      
  });

  describe('POST /posts', function () {

    beforeEach(async function () { 
      sinon.restore();     
    });

    it('should return 201 and a object of post', async function () {
      // arrange
      const { categoryIds } = postsMock.postBody;
      const categoriesExistence = categoryIds.map(async (categoryId) => {
        sinon.stub(Category, 'findByPk').resolves({ id: categoryId });
      });

      await Promise.all(categoriesExistence);

      sinon.stub(sequelize, 'transaction').callsFake((callback) => callback());
      sinon.stub(BlogPost, 'create').resolves({ id: postsMock .postCreated.id });

      const promisePostCategory = categoryIds.map(async (categoryId) => {
        sinon.stub(PostCategory, 'create').resolves({
          postId: postsMock.postCreated.id,
          categoryId,
         });
      });
      await Promise.all(promisePostCategory);

      sinon.stub(BlogPost, 'findByPk').resolves(postsMock.postFindModelSequelize);

      const bodyRequest = { ...postsMock.postBody };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(201);
      expect(body).to.have.property('id', postsMock.postCreated.id);
      expect(body).to.have.property('title', postsMock.postCreated.title);
      expect(body).to.have.property('content', postsMock.postCreated.content);
      expect(body).to.have.property('userId', postsMock.postCreated.userId);
      expect(body).to.have.property('published', postsMock.postCreated.published);
      expect(body).to.have.property('updated', postsMock.postCreated.updated);
    });

  });
});