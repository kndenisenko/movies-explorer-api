// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

// const { NODE_ENV, JWT_SECRET } = process.env;

// Значаение payload будет перезаписано, поэтому оно создано через let
let payload;

// Обработка авторизации
const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  // Если аутентификация неудачна
  if (!auth) {
    throw new UnauthorizedError('Неверный логин или пароль');
  }

  const token = auth.replace('Bearer ', '');

  // console.log('middlewares/auth.js, process.env.NODE_ENV', process.env.NODE_ENV);
  // console.log('middlewares/auth.js, process.env.JWT_SECRET', process.env.JWT_SECRET);

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'blah-blah-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = { isAuthorized };
