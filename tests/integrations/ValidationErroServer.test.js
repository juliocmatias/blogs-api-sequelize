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

function validationErrorServer(url, method, stubOpt, methodStubOpt, bodyRequest, token) {
  return describe('Validation error server', function () {

    let tokenRequest = '';

    beforeEach(async function () { 
      sinon.restore();
      // arrange
      sinon.stub(User, 'findOne').resolves(userMock.userModelSequelize);
  
      const bodyRequest = { email: userMock.userId1.email, password: userMock.userId1.password };
  
      const { body: { token } } = await chai.request(app).post('/login').send(bodyRequest);
      
      tokenRequest = token;      
    });

    it('should return 500 if an error occurs, with the message "Internal Server Error"', async function () {
      // arrange
      sinon.restore();
      const stubConsoleError = sinon.stub(console, 'error');
      sinon.stub(stubOpt, methodStubOpt).throws(new Error('Error'));

      // act
      const { status, body } = await chai
        .request(app)[method](url)
        .send(bodyRequest)
        .set('Authorization', `Bearer ${tokenRequest}`);

      // assert
      expect(status).to.equal(500);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('Internal Server Error');
      expect(stubConsoleError).to.have.been.calledOnce;
      expect(stubConsoleError).to.have.been.calledWith('error server ------', 'Error');
    });

  });
}

module.exports = validationErrorServer;