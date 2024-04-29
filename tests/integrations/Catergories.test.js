const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');
const { Category } = require('../../src/models');
const { User } = require('../../src/models');
const { categoriesMock, userMock } = require('../mocks');
const { describe } = require('mocha');
const validationItToken = require('./ValidationItToken.test');
const validationErrorServer = require('./ValidationErroServer.test');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('Categories test', function () {
  let tokenRequest = '';

  beforeEach(async function () { 
    sinon.restore();
    // arrange
    sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);

    const bodyRequest = { email: userMock.userId1.email, password: userMock.userId1.password };

    const { body: { token } } = await chai.request(app).post('/login').send(bodyRequest);
    
    tokenRequest = token;      
  });

  describe('GET /categories', function () {

    beforeEach(function () { 
      sinon.restore();
    });

    it('should return 200 and a array of categories', async function () {
      // arrange
      sinon.stub(Category, 'findAll').resolves(categoriesMock.categories);

      // act

      const { status, body } = await chai.request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${tokenRequest}`);

      // assert
  
      expect(status).to.equal(200);
      expect(body).to.be.an('array');
      expect(body).to.be.deep.equal(categoriesMock.categories);
    });

    validationItToken('/categories', 'get');

    validationErrorServer('/categories', 'get', Category, 'findAll', {});
  });

  describe('POST /categories', function () {

    beforeEach(function () {
      sinon.restore();
    });

    it('should return 201 and a category when the category is created', async function () {
      // arrange
      sinon.stub(Category, 'create').resolves(categoriesMock.newCategoryModelSequelize);

      const bodyRequest = { name: categoriesMock.newCategory.name };

      // act

      const { status, body } = await chai.request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert
  
      expect(status).to.equal(201);
      expect(body).to.be.an('object');
      expect(body).to.be.deep.equal(categoriesMock.newCategory);
    });

    it('should return 400 if the name is not sent, with the message ""name" is required"', async function () {
      // arrange
      sinon.stub(Category, 'create').resolves(categoriesMock.newCategoryModelSequelize);

      const bodyRequest = {};

      // act

      const { status, body } = await chai.request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${tokenRequest}`)
        .send(bodyRequest);

      // assert
  
      expect(status).to.equal(400);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('"name" is required');
    });

    validationItToken('/categories', 'post');

    validationErrorServer('/categories', 'post', Category, 'create', { name: categoriesMock.newCategory.name });
  });
});