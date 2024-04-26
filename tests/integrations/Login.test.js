const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');
const { User } = require('../../src/models');
const { userMock } = require('../mocks');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

describe('login test', function () {
  describe('POST /login', function () {
    beforeEach(function () { sinon.restore(); });
    it('should return 200 and a token when the user is found', async function () {
      // arrange
      sinon.stub(User, 'findOne').resolves(userMock.users[0]);

      const bodyReq = {
        email: userMock.userId1.email,
        password: userMock.userId1.password,
      };

      // act

      const { status, body } = await chai.request(app)
        .post('/login')
        .send(bodyReq)

      // assert
  
      expect(status).to.equal(200);
      expect(body).to.have.property('token');
    });
  });
});