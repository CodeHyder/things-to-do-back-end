const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const MESSAGES = {
  userNotFound: 'Usuário não encontrado.',
  invalidPassword: 'Senha inválida.',
  emailInUse: 'E-mail já está em uso.',
  registrationSuccess: 'Usuário registrado com sucesso!',
  loginSuccess: 'Login realizado com sucesso!',
};

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
      audience: 'your-app-name',
      issuer: 'your-app-name',
    }
  );
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: MESSAGES.userNotFound });
    }
    const userId = user._id;


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: MESSAGES.invalidPassword });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: MESSAGES.loginSuccess, token, userId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login.', error });
  }
};

exports.registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, senha e username são obrigatórios.' });
    }

    const newUser = new User({
      email,
      password,
      username,
    });

    await newUser.save();

    res.status(201).json({ message: MESSAGES.registrationSuccess });
  } catch (error) {
    if (error.message && error.message.startsWith('Erro de validação')) {
      return res.status(400).json({ error: error.message });
    }
    else if (error.code === 11000) {
      const field = error.keyValue.email ? 'email' : 'username';
      return res.status(400).json({
        error: `Já existe um usuário com este ${field}.`
      });
    }
    res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
};

exports.getUsername = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token não encontrado.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;


    if (userId !== req.params.id) {
      return res.status(403).json({ message: 'Acesso não autorizado.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o nome do usuário', error });
  }
};