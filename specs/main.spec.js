'use strict';

let request = require('supertest');

request = request('http://localhost:4000');

describe('main route', () => {
  it('/ route should respond with 200', (done) => {
    request
      .get('/')
      .expect('Content-type', /text\/html/)
      .expect(200, (err) => {
        if (err) console.log(err);
        else done();
      });
  });
});

describe('search user route', () => {
  it('/searchUser route should respond with 200 when username given', (done) => {
    request
      .post('/searchUser')
      .send({username: 'roeland'})
      .expect('Content-type', /text\/html/)
      .expect(200, (err) => {
        if (err) console.log(err);
        else done();
      });
  });

  it('/searchUser route should respond with 400 when NO username given', (done) => {
    request
      .post('/searchUser')
      .send({username: ''})
      .expect('Content-type', /text\/html/)
      .expect(400, (err) => {
        if (err) console.log(err);
        else done();
      });
  });
});

describe('user route', () => {
  it('/user/:username route should respond with 200 when valid username given', (done) => {
    request
      .get('/user/RoelandDS')
      .expect('Content-type', /text\/html/)
      .expect(200, (err) => {
        if (err) console.log(err);
        else done();
      });
  });
});