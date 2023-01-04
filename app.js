// Dependencies from NPM
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// User's dependencies
const { Error404 } = require('./errors/error404');
const { error500 } = require('./errors/error500');

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:27017',
    'https://badass.nomoredomains.club',
    'https://api.badass.nomoredomains.club',
    // 'https://YOUR.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

// подключаем dotenv
dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

// Подключаем защиту от DDoS
// Ограничиваем количество запросов в 15 минут до 300 штук
// Хотя всё равно они прилетят за первые секунды. Наверное :)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('*', cors(options));

// Подключаем логгер запросов
app.use(requestLogger);

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Используем helmet и body parser
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД moongoose
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие
// Вот тут роуты всякие

// Подключаем логгер ошибок
app.use(errorLogger);

// Ошибка 404 для несуществующих страниц
app.use((req, res, next) => {
  next(new Error404('Ошибка 404 - Страницы не существует'));
});

// Обработка ошибок celebrate, его допилить - нет error
app.use(errors(app.err));

// Обработка ошибок сервера, ошибка 500
app.use((err, req, res, next) => {
  error500(err, req, res, next);
});

app.listen(PORT, () => {
  // console.log('Ссылка на сервер:');
  // console.log('http://localhost:' + PORT);
  // console.log(doomer)
});
