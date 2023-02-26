const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');

// const { NODE_ENV, JWT_SECRET } = process.env;

// Контроллер изменения имени и почты Юзера updateUser
function updateUser(req, res, next) {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Некорректное ID пользователя'));
      } else {
        next(err);
      }
    });
}

// Создание нового юзера
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    })
      .then((user) => {
        const data = {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
        res.status(201).send(data);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('409 - Почта уже используется, смените почту'));
        } else if (err.name === 'ValidationError') {
          next(new ValidationError('400 - Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

// Логин существующего юзера
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'blah-blah-key', { expiresIn: '7d' });
      res.send({ token, userId: user._id });
    })
    .catch((err) => {
      next(err);
    });
};

// Получить инфо о юзере
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        user_id: user._id,
      });
    })
    .catch((err) => next(err));
};

// Изменить инфо о юзере
module.exports.patchUpdateUser = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        updateUser(req, res, next);
      } else if (user._id.toString() === req.user._id) {
        updateUser(req, res, next);
      } else {
        next(new ConflictError('409 - Почта уже используется, смените почту'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 —  Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};
