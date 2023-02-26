const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.postMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка на картинку');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка на трейлер');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка на thumbnail');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string(),
  }),
});

module.exports.deleteMovies = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
