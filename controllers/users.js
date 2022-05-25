const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const CastError = require('../errors/CastError');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Нет пользователя с переданным Id'))
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Некорректный Id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => User.create(
      {
        name, email, password: hash,
      },
    ))
    .then(() => res.status(200).send({
      data: {
        name,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные при редактировании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(() => {
      next(new AuthorizationError('Неправильная почта или пароль'));
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Нет пользователя с переданным Id'))
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным Id'));
      } else {
        next(err);
      }
    });
};
