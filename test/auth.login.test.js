const request = require('supertest');
const app = require('../src/app');
const User = require('../src/model/user.model');

describe('POST /api/auth/login', () => {
  it('should login an existing user with email and return 200 and cookie', async () => {
    // create a user directly in DB (password must be hashed by controller on register)
    const payload = {
      username: 'loginuser',
      email: 'login@example.com',
      password: 'mypassword',
      fullName: { firstName: 'Log', lastName: 'In' }
    };

    // Register through the API so password is hashed and cookie set
    const registerRes = await request(app).post('/api/auth/register').send(payload);
    expect(registerRes.status).toBe(201);

    // Attempt login using email
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ identifier: payload.email, password: payload.password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('message', 'login successful');
    expect(loginRes.body).toHaveProperty('user');
    expect(loginRes.body.user).toHaveProperty('email', payload.email);
    expect(loginRes.body.user).toHaveProperty('username', payload.username);
    expect(loginRes.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    const payload = {
      username: 'loginuser2',
      email: 'login2@example.com',
      password: 'rightpassword',
      fullName: { firstName: 'R', lastName: 'P' }
    };

    await request(app).post('/api/auth/register').send(payload);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: payload.email, password: 'wrong' });

    expect(res.status).toBe(401);
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ identifier: 'x' });
    expect(res.status).toBe(400);
  });
});
