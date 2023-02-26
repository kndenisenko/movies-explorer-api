const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const { isAuthorized } = require('../middlewares/auth');
const { PageNotFoundError } = require('../errors/PageNotFoundError');
const users = require('./users');
const movies = require('./movies');

module.exports = (app) => {
// Создание нового юзера
  app.use('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), createUser);

  // логин
  app.use('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login);

  app.use('/', isAuthorized, users);
  app.use('/', isAuthorized, movies);

  // Ошибка 404, страницы не существует
  app.use((req, res, next) => {
    next(new PageNotFoundError('404 - Страницы не существует'));
  });
};
