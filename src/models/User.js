const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.empty': 'O nome de usuário não pode estar vazio.',
        'string.min': 'O nome de usuário deve ter pelo menos 3 caracteres.',
        'string.max': 'O nome de usuário deve ter no máximo 30 caracteres.',
        'any.required': 'O nome de usuário é obrigatório.',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'O e-mail deve ser válido.',
        'any.required': 'O e-mail é obrigatório.',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'A senha deve ter pelo menos 6 caracteres.',
        'any.required': 'A senha é obrigatória.',
      })
  });

  return schema.validate(user);
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


userSchema.pre('save', async function (next) {

  const userData = {
    username: this.username,
    email: this.email,
    password: this.password,
  };

  const { error } = validateUser(userData);
  if (error) {
    return next(new Error(`Erro de validação: ${error.details[0].message}`));
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
