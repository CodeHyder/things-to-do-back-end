const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');  

 
jest.mock('../../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));

 
jest.mock('../../controllers/userController.js', () => ({
  loginUser: jest.fn((req, res) => res.status(200).json({ token: 'fake-jwt-token', user: { id: 1, username: 'testuser' } })),
  registerUser: jest.fn((req, res) => res.status(201).json({ message: 'User registered successfully' })),
  getUsername: jest.fn((req, res) => res.status(200).json({ id: req.params.id, username: 'testuser' })),
}));

const app = express();
app.use(express.json());
app.use(userRoutes);

describe('User Routes', () => {
  it('POST /login - Deve realizar o login e retornar um token', async () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const response = await request(app).post('/login').send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'fake-jwt-token');
    expect(response.body.user).toEqual({ id: 1, username: 'testuser' });
  });

  it('POST /register - Deve registrar um novo usuário', async () => {
    const registerData = { email: 'newuser@example.com', password: 'securepassword' };
    const response = await request(app).post('/register').send(registerData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('GET /username/:id - Deve retornar o nome de usuário do ID fornecido', async () => {
    const response = await request(app).get('/username/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', username: 'testuser' });
  });
});
