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

  describe('POST /post, create new post', function () {

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
    
    validationErrorServer('/post', 'post', Category, 'findByPk', { ...postsMock.postBody });
    validationItToken('/post', 'post');
  });

  describe('GET /post, gets posts by id that is in the user token', function () {
      
      beforeEach(async function () { 
        sinon.restore();     
      });
  
      it('should return 200 and a series of posts by user Id', async function () {
        // arrange
        sinon.stub(BlogPost, 'findAll').resolves(postsMock.postsUserId1);
  
        // act
  
        const { status, body } = await chai.request(app)
          .get('/post')
          .set('authorization', `Bearer ${tokenRequest}`);
  
        // assert
  
        expect(status).to.be.equals(200);
        expect(body).to.be.an('array');
        expect(body).to.have.lengthOf(3);
        expect(body[2]).to.have.property('id', postsMock.postCreated.id);
        expect(body[2]).to.have.property('title', postsMock.postCreated.title);
        expect(body[2]).to.have.property('content', postsMock.postCreated.content);
        expect(body[2]).to.have.property('userId', userMock.userId1.id);
        expect(body[2]).to.have.property('published', postsMock.postCreated.published);
        expect(body[2]).to.have.property('updated', postsMock.postCreated.updated);
      });

      validationItToken('/post', 'get');
      validationErrorServer('/post', 'get', BlogPost, 'findAll');
  });

  describe('GET /post/:id, gets post by id', function () {
        
      beforeEach(async function () { 
        sinon.restore();     
      });
  
      it('should return 200 and a post by id', async function () {
        // arrange
        sinon.stub(BlogPost, 'findByPk').resolves(postsMock.postsUserId1[0]);
  
        // act
  
        const { status, body } = await chai.request(app)
          .get('/post/1')
          .set('authorization', `Bearer ${tokenRequest}`);
  
        // assert
  
        expect(status).to.be.equals(200);
        expect(body).to.be.an('object');
        expect(body).to.have.property('id', postsMock.postsUserId1[0].id);
        expect(body).to.have.property('title', postsMock.postsUserId1[0].title);
        expect(body).to.have.property('content', postsMock.postsUserId1[0].content);
        expect(body).to.have.property('userId', postsMock.postsUserId1[0].userId);
        expect(body).to.have.property('published', postsMock.postsUserId1[0].published);
        expect(body).to.have.property('updated', postsMock.postsUserId1[0].updated);
        expect(body).to.have.property('user');
        expect(body).to.have.property('categories');
      });
  
      it('should return 404 when post not found, with a message "Post does not exist"', async function () {
        // arrange
        sinon.stub(BlogPost, 'findByPk').resolves(null);
  
        // act
  
        const { status, body } = await chai.request(app)
          .get('/post/1')
          .set('authorization', `Bearer ${tokenRequest}`);
  
        // assert
  
        expect(status).to.be.equals(404);
        expect(body).to.have.property('message', 'Post does not exist');
      });
  
      validationItToken('/post/1', 'get');
      validationErrorServer('/post/1', 'get', BlogPost, 'findByPk');
  });

  describe('PUT /post/:id, update post by id', function () {

    this.beforeEach(async function () {
      sinon.restore();
    });

    it('should return 200 and a post updated', async function () {
      // arrange
      sinon.stub(BlogPost, 'findByPk').onFirstCall()
        .resolves(postsMock.postCreated)
        .onSecondCall()
        .resolves(postsMock.findPostUpdated);
      
      sinon.stub(BlogPost, 'update').resolves([1]);


      const bodyRequest = postsMock.bodyPostUpdate;

      // act

      const { status, body } = await chai.request(app)
        .put('/post/1')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(200);
      expect(body).to.have.property('id', postsMock.findPostUpdated.id);
      expect(body).to.have.property('title', postsMock.findPostUpdated.title);
      expect(body).to.have.property('content', postsMock.findPostUpdated.content);
      expect(body).to.have.property('userId', postsMock.findPostUpdated.userId);
      expect(body).to.have.property('published', postsMock.findPostUpdated.published);
      expect(body).to.have.property('updated', postsMock.findPostUpdated.updated);
      expect(body).to.have.property('user');
      expect(body).to.have.property('categories');
    });

    it('should return 404 when post not found, with a message "Post does not exist"', async function () {
      // arrange
      sinon.stub(BlogPost, 'findByPk').resolves(null);

      const bodyRequest = postsMock.bodyPostUpdate;

      // act

      const { status, body } = await chai.request(app)
        .put('/post/1')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(404);
      expect(body).to.have.property('message', 'Post does not exist');
    });

    it('should return 401 when the user is not the owner of the post, with a message "Unauthorized user"', async function () {
      // arrange
      const postUserDifferent = { ...postsMock.postCreated, userId: 9999 };
      
      sinon.stub(BlogPost, 'findByPk').resolves(postUserDifferent);

      const bodyRequest = postsMock.bodyPostUpdate;

      // act

      const { status, body } = await chai.request(app)
        .put('/post/9999')
        .set('authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert

      expect(status).to.be.equals(401);
      expect(body).to.have.property('message', 'Unauthorized user');
    });

    it('should return 400 when the title or content is not sent, with a message "Some required fields are missing"', async function () {
      // arrange
      const bodyRequest = { ...postsMock.bodyPostUpdate };
      
      const requiredFields = ['title', 'content'];

      const promiseRequiredFields = requiredFields.map(async (field) => {
        const body = { ...bodyRequest, [field]: '' };

        // act
        const { status, body: bodyResponse } = await chai.request(app)
        .put('/post/1')
          .set('authorization', `Bearer ${tokenRequest}`)
          .send(body);

        // assert

        expect(status).to.be.equals(400);
        expect(bodyResponse).to.have.property('message', 'Some required fields are missing');
      });
      
      await Promise.all(promiseRequiredFields);
    });
    
    validationErrorServer('/post/1', 'put', BlogPost, 'findByPk', postsMock.bodyPostUpdate);
    validationItToken('/post/1', 'put');
  });
});