const constants = {
  REG_LINK: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  MONGO_BASE_DEV: 'mongodb://localhost:27017/bitfilmsdbdev',
  MONGO_BASE: 'mongodb://localhost:27017/bitfilmsdb',
  EMAIL_USERNAME_VALIDATION_FAILED: 'Ошибка 400 - некорретный адрес электронной почты или имени пользователя',
  MOVIE_VALIDATION_FAILED: 'Ошибка 400 - Переданы некорректные данные при создании фильма',
  MOVIE_ID_VALIDATION_FAILED: 'Ошибка 400 - Передан неверный id',
  USER_CREDENTIALS_VALIDATION_FAILED: 'Ошибка 400 - переданы некорректные данные при создании пользователя',
  USER_CREDENTIALS_UPDATE_FAILED: 'Ошибка 400 - переданы некорректные данные при обновлении профиля пользователя',
  AUTH_REQUIRED: 'Ошибка 401 - Необходима авторизация',
  AUTH_FAILED_NOT_FOUND: 'Ошибка 401 - пользователь не найден',
  AUTH_FAILED: 'Ошибка 401 - неправильная почта или пароль',
  AUTH_FAILED_TOCKEN_CHECK: 'Ошибка 401 - ошибка проверки токена, необходима авторизация',
  CANT_DELETE_OTHER_MOVIES: 'Ошибка 403 — Нельзя удалять чужие фильмы',
  ID_NOT_FOUND: 'Ошибка 404 - Фильм с указанным id не найден',
  REG_FAILED_EMAIL_IS_USED: 'Ошибка 409 - почта уже используется, смените почту',
  MOVIE_ALREADY_CREATED: 'Ошибка 409 - Такой фильм уже существует',

};

module.exports = { constants };
