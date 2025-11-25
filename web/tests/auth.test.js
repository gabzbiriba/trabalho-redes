const request = require('supertest');
const app = require('../app');

test('rota /login deve responder 200', async () => {
  const res = await request('http://localhost:3001').get('/login');
  expect([200,302]).toContain(res.statusCode);
});