// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Значаение payload будет перезаписано, поэтому оно создано через let
let payload;

// Обработка авторизации
const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  // console.log('back, isAuthorized req.headers.authorization: ', auth);

  // Если аутентификация неудачна
  if (!auth) {
    throw new UnauthorizedError('Введите логин и пароль');
  }

  const token = auth.replace('Bearer ', '');
  // console.log('----------------------');
  // console.log('backed, isAuthorized token:', token);
  // console.log('----------------------');
  // console.log('backed, isAuthorized payload:', payload);
  // console.log('----------------------');
  // console.log('middlewares NODE_ENV', NODE_ENV);
  //   // console.log('middlewares JWT', JWT_SECRET);

  // console.log('middlewares/auth.js, NODE_ENV', NODE_ENV);
  // console.log('middlewares/auth.js, JWT_SECRET', JWT_SECRET);

  console.log('middlewares/auth.js, NODE_ENV', NODE_ENV);
  console.log('middlewares/auth.js, JWT_SECRET', JWT_SECRET);

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'blah-blah-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = { isAuthorized };
