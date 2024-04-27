const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');
const { User } = require('../../src/models');
const { userMock } = require('../mocks');
const validationErrorServer = require('./ValidationErroServer.test');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('login test', function () {
  describe('POST /login', function () {

    const bodyReq = {
      email: userMock.userId1.email,
      password: userMock.userId1.password,
    };

    beforeEach(function () { 
      sinon.restore();
    });

    it('should return 200 and a token when the user is found', async function () {
      // arrange

      sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);

      // act

      const { status, body } = await chai.request(app)
        .post('/login')
        .send(bodyReq)

      // assert
  
      expect(status).to.equal(200);
      expect(body).to.have.property('token');
    });

    it('should return 400 if the email and password are not sent, with the message "Some required fields are missing"', async function () {
      // arrange
      const bodyReqField = {
        email: userMock.userId1.email,
        password: userMock.userId1.password,
      };
      
      const requestRequiredFields = ['email', 'password'];
      const promise = requestRequiredFields.map(async (field) => {
        // act
        delete bodyReqField[field];

        const { status, body } = await chai.request(app)
          .post('/login')
          .send(bodyReqField);

        // assert
        expect(status).to.equal(400);
        expect(body).to.have.property('message');
        expect(body.message).to.be.deep.equal('Some required fields are missing');
      });
     return await Promise.all(promise);
    });

    it('should return 400 if the user is not found, with the message "Invalid fields"', async function () {
      // arrange
      sinon.stub(User, 'findOne').resolves(null);

      // act
      const { status, body } = await chai.request(app)
        .post('/login')
        .send(bodyReq);

      // assert

      expect(status).to.equal(400);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('Invalid fields');
    });

    it('should return 400 if the password is incorrect, with the message "Invalid fields"', async function () {
      // arrange
      sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);

      // act
      const { status, body } = await chai.request(app)
        .post('/login')
        .send({ ...bodyReq, password: 'wrongPassword' });

      // assert

      expect(status).to.equal(400);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('Invalid fields');
    });

    validationErrorServer('/login', 'post', User, 'findOne', bodyReq);
  });
});