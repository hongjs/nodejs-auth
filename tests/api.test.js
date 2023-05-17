import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

chai.use(chaiHttp);
let token = null;

describe('Test API', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/auth')
      .send({ email: 'sompote.r@gmail.com', password: '123456' })
      .end((err, res) => {
        token = res.body.token;
        expect(token, 'Invalid Token').to.not.be.empty;
      });

    done();
  });

  describe('Test user', () => {
    const data = {
      email: 'aaaa@gmail.com',
      password: '1111',
      password2: '1111',
      name: 'test',
    };

    it('Should not GET user', async () => {
      const res = await chai.request(server).get('/api/user/list');
      expect(res.status).to.be.eq(401);
    });

    it('Should GET user count', async () => {
      const res = await chai
        .request(server)
        .get('/api/user/list')
        .set({ Authorization: `Bearer ${token}` });

      const length = res.body.length || 0;
      expect(length).to.be.above(0);
    });

    it('Should Create new user', async () => {
      const res = await chai
        .request(server)
        .post('/api/user')
        .set({ Authorization: `Bearer ${token}` })
        .send(data);
      expect(res.body.name).to.eq(data.name);
    });
  });
});
