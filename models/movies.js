const mongoose = require('mongoose');
const { constants } = require('../const/const');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // тип поля - строка
    required: true, // обязательное поле
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => constants.REG_LINK.test(v),
      message: () => 'Неправильный формат ссылки на картинку',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => constants.REG_LINK.test(v),
      message: () => 'Неправильный формат ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => constants.REG_LINK.test(v),
      message: () => 'Неправильный формат ссылки на thumbnail',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    unique: true,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
