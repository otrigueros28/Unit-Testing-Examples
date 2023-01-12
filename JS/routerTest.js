const app = require('supertest')(require('./server/index'));
const db = require('./db');
const { expect } = require('chai');

describe('routes', ()=> {
  let seed;
  beforeEach(async()=> seed = await db.sync())

  describe('GET /api/login', ()=>{
    describe('When not logged in', ()=> {
     it('returns a 401', async ()=>{
       const response = await app.get('/api/login')
       expect(response.status).to.equal(401);
     })
    })
    describe('When logged in', ()=>{
      let cookie;
      beforeEach( async()=> {
        const response = await app.post('/api/login')
          .send({ email: 'oscar@email.com', password: 'Oscar'})
        cookie = response.headers['set-cookie']
      })
      it('returns a 200 with the user', async()=>{
        const response = await app.get('/api/login')
          .set('cookie', cookie)
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Oscar')
      })
    })
  })
  describe('POST /api/login', ()=>{
    discribe('With correct credentials', ()=>{
      it('returns 204 with a cookie', async ()=>{
        const response = await app.post('/api/sessions')
          .send({email: 'oscar@email.com', password: 'OSCAR'})
        expect(response.status).to.equal(204);
        expect(response.headers['set-cookie']).to.be.ok
      })
    })
    describe('With wrong credentials', ()=>{
      it('returns 401', async ()=>{
        const response = await app.post('/api/sessions')
          .send({email: 'alex@email.com', password: 'alexandra'});
        expect(response.status).to.equal(401);
      })
    })
  })
  describe('DELETE /api/logout', ()=>{
    let cookie;
    beforeEach(async()=>{
      const response = await app.post('/api/logout')
        .send({email: 'oscar@email.com', password: 'OSCAR'})
      cookie = response.headers['set-cookie']
    })
    it('returns a 204', async ()=>{
      let response = await app.delete('/api/logout')
        .set('cookie', cookie)

      expect(response.status).to.equal(204);

      response = await app.get('/api/logout')
        .set('cookie', cookie)
      expect(response.status).to.equal(401);
    })
  })
})