
const User = require('../../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userController = require('../../controllers/userController.js'); // Altere o caminho se necessário

jest.mock('../../models/User.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('Deve retornar erro 400 se email ou senha não forem fornecidos', async () => {
      mockRequest.body = {};

      await userController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email e senha são obrigatórios.',
      });
    });

    it('Deve retornar erro 404 se o usuário não for encontrado', async () => {
      mockRequest.body = { email: 'teste@teste.com', password: '123456' };
      User.findOne.mockResolvedValue(null);

      await userController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário não encontrado.',
      });
    });

    it('Deve retornar erro 401 se a senha for inválida', async () => {
      mockRequest.body = { email: 'teste@teste.com', password: '123456' };
      User.findOne.mockResolvedValue({ email: 'teste@teste.com', password: 'hash' });
      bcrypt.compare.mockResolvedValue(false);

      await userController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Senha inválida.',
      });
    });

    it('Deve realizar login e retornar um token se as credenciais forem válidas', async () => {
      mockRequest.body = { email: 'teste@teste.com', password: '123456' };
      const user = { _id: 'mockUserId', email: 'teste@teste.com', password: 'hash' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await userController.loginUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login realizado com sucesso!',
        token: 'mockToken',
        userId: user._id,
      });
    });
  });

  describe('registerUser', () => {
    it('Deve retornar erro 400 se email, senha ou username não forem fornecidos', async () => {
      mockRequest.body = {};

      await userController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email, senha e username são obrigatórios.',
      });
    });

    it('Deve retornar erro 400 se o email já estiver em uso', async () => {
      mockRequest.body = { email: 'teste@teste.com', password: '123456', username: 'user' };
      const error = { code: 11000, keyValue: { email: 'teste@teste.com' } };
      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error),
      }));

      await userController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Já existe um usuário com este email.',
      });
    });

    it('Deve registrar um novo usuário se os dados forem válidos', async () => {
      mockRequest.body = { email: 'teste@teste.com', password: '123456', username: 'user' };
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));

      await userController.registerUser(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário registrado com sucesso!',
      });
    });
  });

  describe('getUsername', () => {
    it('Deve retornar erro 401 se o token não for fornecido', async () => {
      mockRequest.headers.authorization = null;

      await userController.getUsername(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token não encontrado.',
      });
    });

    it('Deve retornar erro 403 se o ID do token não corresponder ao ID solicitado', async () => {
      mockRequest.headers.authorization = 'Bearer mockToken';
      mockRequest.params.id = 'anotherUserId';
      jwt.verify.mockReturnValue({ id: 'mockUserId' });

      await userController.getUsername(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acesso não autorizado.',
      });
    });

    it('Deve retornar erro 404 se o usuário não for encontrado', async () => {
      mockRequest.headers.authorization = 'Bearer mockToken';
      mockRequest.params.id = 'mockUserId';
      jwt.verify.mockReturnValue({ id: 'mockUserId' });
      User.findById.mockResolvedValue(null);

      await userController.getUsername(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuário não encontrado',
      });
    });

    it('Deve retornar o username do usuário se o token e ID forem válidos', async () => {
      mockRequest.headers.authorization = 'Bearer mockToken';
      mockRequest.params.id = 'mockUserId';
      jwt.verify.mockReturnValue({ id: 'mockUserId' });
      User.findById.mockResolvedValue({ username: 'mockUsername' });

      await userController.getUsername(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        username: 'mockUsername',
      });
    });
  });
});
