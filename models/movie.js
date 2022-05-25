const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Страна создания фильма не указана'],
  },

  director: {
    type: String,
    required: [true, 'Режиссёр фильма не указан'],
  },

  duration: {
    type: Number,
    required: [true, 'Длительность фильма не указана'],
  },

  year: {
    type: String,
    required: [true, 'Год выпуска фильма не указан'],
  },

  description: {
    type: String,
    required: [true, 'Описание фильма не указано'],
  },

  image: {
    type: String,
    required: [true, 'Ссылка на постер не указана'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорреткная ссылка',
    },
  },

  trailerLink: {
    type: String,
    required: [true, 'Ссылка на трейлер не указана'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорреткная ссылка',
    },
  },

  thumbnail: {
    type: String,
    required: [true, 'Постер не указан'],
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: 'Некорреткная ссылка',
    },
  },

  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: [true, 'Id пользователя не указан'],
  },

  movieId: {
    type: Number,
    ref: 'MoviesExplorer',
    required: [true, 'Id фильма из MoviesExplorer не указан'],
  },

  nameRU: {
    type: String,
    required: [true, 'Русское название фильма не указано'],
  },

  nameEN: {
    type: String,
    required: [true, 'Английское название фильма не указано'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
