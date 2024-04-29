const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
const app = require('../../src/app');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiHttp);

function validationItToken(url, method) {
  return describe('Validation of token', function () {

    beforeEach(async function () { 
      sinon.restore();
    });

    it('should return 401 if the token is invalid, with the message "Expired or invalid token"', async function () {
      // act
      const { status, body } = await chai
        .request(app)[method](url)
        .set("Authorization", 'Bearer invalid_token')

      // assert
  
      expect(status).to.equal(401);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('Expired or invalid token');
    });

    it('should return 401 if the token is not sent, with the message "Token not found"', async function () {
      // act

      const { status, body } = await chai
        .request(app)[method](url);

      // assert
  
      expect(status).to.equal(401);
      expect(body).to.have.property('message');
      expect(body.message).to.be.deep.equal('Token not found');
    });
  });
}

module.exports = validationItToken;