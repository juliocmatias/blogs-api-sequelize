const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');
const { User } = require('../../src/models');
const { userMock } = require('../mocks');
const validationErrorServer = require('./ValidationErroServer.test');
const validationItToken = require('./ValidationItToken.test');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('Users test', function () {
  let tokenRequest = '';

  beforeEach(async function () { 
    sinon.restore();
    // arrange
    sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);

    const bodyRequest = { email: userMock.userId1.email, password: userMock.userId1.password };

    const { body: { token } } = await chai.request(app).post('/login').send(bodyRequest);
    
    tokenRequest = token;      
  });

  describe('POST /user', function () {

    beforeEach(function () {
      sinon.restore();
    });
    
    it('should return 201 and a token when the user is created', async function () {
      // arrange
      sinon.restore();
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(userMock.newUserModelSequelize);

      // act
      const { status, body } = await chai.request(app)
        .post('/user')
        .send(userMock.newUser);
      
      // assert
      expect(status).to.equal(201);
      expect(body).to.have.property('token');
    });

    it('should return 400 if the displayName is less than 8 characters, with a message ""displayName" length must be at least 8 characters long"', async function () {
      // arrange
      const user = { ...userMock.newUser, displayName: 'a' };
      
      // act
      const { status, body } = await chai.request(app)
        .post('/user')
        .send(user);
      
      // assert
      expect(status).to.equal(400);
      expect(body).to.have.property('message', '"displayName" length must be at least 8 characters long');
    });

    it('should return 400 if the email is invalid, with a message ""email" must be a valid email"', async function () {
      // arrange
      const user = { ...userMock.newUser, email: 'email' };
      
      // act
      const { status, body } = await chai.request(app)
        .post('/user')
        .send(user);
      
      // assert
      expect(status).to.equal(400);
      expect(body).to.have.property('message', '"email" must be a valid email');
    });

    it('should return 400 if the password is less than 6 characters, with a message ""password" length must be at least 6 characters long"', async function () {
      // arrange
      const user = { ...userMock.newUser, password: '12345' };
      
      // act
      const { status, body } = await chai.request(app)
        .post('/user')
        .send(user);
      
      // assert
      expect(status).to.equal(400);
      expect(body).to.have.property('message', '"password" length must be at least 6 characters long');
    });

    it('should return 409 if the user already exists, with a message "User already registered"', async function () {
      // arrange
      sinon.restore();
      sinon.stub(User, 'findOne').resolves(userMock.newUserModelSequelize);
      
      // act
      const { status, body } = await chai.request(app)
        .post('/user')
        .send(userMock.newUser);
      
      // assert
      expect(status).to.equal(409);
      expect(body).to.have.property('message', 'User already registered');
    });

    validationErrorServer('/user', 'post', User, 'findOne', userMock.newUser);
  });

  describe('GET /user', function () {

    beforeEach(function () {
      sinon.restore();
    });

    it('should return 200 and all users without the password', async function () {
      // arrange
      sinon.stub(User, 'findAll').resolves(userMock.usersWithoutPass);
      
      // act
      const { status, body } = await chai.request(app)
        .get('/user')
        .set('authorization', `Bearer ${tokenRequest}`);
      
      // assert
      expect(status).to.equal(200);
      expect(body).to.be.an('array');
      expect(body[0]).to.not.have.property('password');
    });

    validationItToken('/user', 'get', User, 'findAll', userMock.usersWithoutPass);
    validationErrorServer('/user', 'get', User, 'findAll', userMock.usersWithoutPass);
  });

  describe('GET /user/:id', function () {

    beforeEach(function () {
      sinon.restore();
    });
    
    it('should return 200 and the user without the password', async function () {
      // arrange
      sinon.stub(User, 'findByPk').resolves(userMock.usersWithoutPass[0]);
      
      // act
      const { status, body } = await chai.request(app)
        .get('/user/1')
        .set('authorization', `Bearer ${tokenRequest}`);
      
      // assert
      expect(status).to.equal(200);
      expect(body).to.not.have.property('password');
    });

    it('should return 404 if the user is not found, with a message "User does not exist"', async function () {
      // arrange
      sinon.stub(User, 'findByPk').resolves(null);

      // act

      const { status, body } = await chai.request(app)
        .get('/user/1')
        .set('authorization', `Bearer ${tokenRequest}`);
      
      // assert
      expect(status).to.equal(404);
      expect(body).to.have.property('message', 'User does not exist');
    });

    validationItToken('/user/1', 'get', User, 'findByPk', userMock.usersWithoutPass[0]);
    validationErrorServer('/user/1', 'get', User, 'findByPk', userMock.usersWithoutPass[0]);
  });
});