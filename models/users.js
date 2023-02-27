const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { constants } = require('../const/const');
// const { REG_LINK } = require('../const/regexp');

// схема юзера
const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип поля - строка
    required: true, // Необходимое поле
    minlength: 2, // минимальное количество символов
    maxlength: 30, // максимальное количество символов
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат электропочты',
    },
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
    select: false,
  },
});

// Схема идентификации юзера методами moongoose
// 14 спринт → Тема 2/9: Аутентификация и авторизация. Продолжение → Урок 5/7
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // не нашёлся — отклоняем
      if (!user) {
        return Promise.reject(new UnauthorizedError(constants.AUTH_FAILED_NOT_FOUND));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // Если не совпадает почта или пароль
            return Promise.reject(new UnauthorizedError(constants.AUTH_FAILED));
          }
          return user; // почта и пароль совпал, теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
