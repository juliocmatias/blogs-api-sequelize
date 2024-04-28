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

  describe('POST /post', function () {

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

    it('should return 400 when categories that don\'t exist with a message "one or more "categoryIds" not found"', async function () {
      // arrange
      const { categoryIds } = postsMock.postBody;
      const categoriesExistence = categoryIds.map(async (categoryId) => {
        sinon.stub(Category, 'findByPk').resolves(null);
      });

      await Promise.all(categoriesExistence);

      const bodyRequest = { ...postsMock.postBody };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(400);
      expect(body).to.have.property('message', 'one or more "categoryIds" not found');
    });

    it('should return 500 when an case sequelize throw an error', async function () {
      // arrange
      const { categoryIds } = postsMock.postBody;
      const categoriesExistence = categoryIds.map(async (categoryId) => {
        sinon.stub(Category, 'findByPk').resolves({ id: categoryId });
      });

      await Promise.all(categoriesExistence);

      sinon.stub(sequelize, 'transaction').throws(Error('Internal Server Error'));


      const bodyRequest = { ...postsMock.postBody };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(500);
      expect(body).to.have.property('message', 'Internal Server Error');
    });

    it('should return 500 when an case postsService throw an error', async function () {
      const { categoryIds } = postsMock.postBody;
      const categoriesExistence = categoryIds.map(async (categoryId) => {
        sinon.stub(Category, 'findByPk').throws(Error('Internal Server Error'));
      });

      await Promise.all(categoriesExistence);


      const bodyRequest = { ...postsMock.postBody };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(500);
      expect(body).to.have.property('message', 'Internal Server Error');
    });

    it('should return 400 when the categoryIds are not sent, with a message "Some required fields are missing"', async function () {
      // arrange
      const bodyRequest = { ...postsMock.postBody };
      
      const { categoryIds, ...rest } = bodyRequest;

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(rest);

      // assert

      expect(status).to.be.equals(400);
      expect(body).to.have.property('message', 'Some required fields are missing');
    });

    it('should return 400 when the categoryIds are not an array, with a message "Some required fields are missing"', async function () {
      // arrange
      const bodyRequest = { ...postsMock.postBody, categoryIds: '1' };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(400);
      expect(body).to.have.property('message', 'Some required fields are missing');
    });

    it('should return 400 when the categoryIds are empty, with a message "Some required fields are missing"', async function () {
      // arrange
      const bodyRequest = { ...postsMock.postBody, categoryIds: [] };

      // act

      const { status, body } = await chai.request(app)
        .post('/post')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(400);
      expect(body).to.have.property('message', 'Some required fields are missing');
    });

    it('should return 400 when the title or content is not sent, with a message "Some required fields are missing"', async function () {
      // arrange
      const bodyRequest = { ...postsMock.postBody };

      const requiredFields = ['title', 'content'];

      const promiseRequiredFields = requiredFields.map(async (field) => {
        const body = { ...bodyRequest, [field]: '' };

        // act
        const { status, body: bodyResponse } = await chai.request(app)
          .post('/post')
          .set('authorization', `Bearer ${tokenRequest}`)
          .send(body);

        // assert

        expect(status).to.be.equals(400);
        expect(bodyResponse).to.have.property('message', 'Some required fields are missing');
      });

      await Promise.all(promiseRequiredFields);
    });

    validationItToken('/post', 'post');
  });
});