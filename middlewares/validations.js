const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidation).required(),
    trailerLink: Joi.string().custom(urlValidation).required(),
    thumbnail: Joi.string().custom(urlValidation).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Передан некорректный Id');
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required().min(8),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }),
});

module.exports = {
  validateMovie,
  validateMovieId,
  validateUser,
  validateLogin,
  validateUpdateUser,
};
