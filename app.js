// Dependencies from NPM
const express = require('express');
const dotenv = require('dotenv');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/index');

// User's dependencies
const cors = require('./middlewares/cors');
const rateLimit = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { NODE_ENV, PORT } = process.env;
const { NoValidIdError } = require('./errors/NoValidIdError');
const error500 = require('./middlewares/errorHandler');

// const options = {
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:27017',
//     'https://badass.nomoredomains.club',
//     'https://api.badass.nomoredomains.club',
//     // 'https://YOUR.github.io',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };

// подключаем dotenv
dotenv.config();

const app = express();
rateLimit(app);
// const { PORT = 3000 } = process.env;

// Подключаем защиту от DDoS
// Ограничиваем количество запросов в 15 минут до 300 штук
// Хотя всё равно они прилетят за первые секунды. Наверное :)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

app.use(cors);

// Подключаем логгер запросов
app.use(requestLogger);

// Используем helmet и body parser
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД moongoose
mongoose.set('strictQuery', false); // убираем warning из консоли при старте
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

route(app);

// Подключаем логгер ошибок
app.use(errorLogger);

// Обработка ошибок celebrate
app.use(errors(app.err));

// Ошибка 404 для несуществующих страниц
app.use((req, res, next) => {
  next(new NoValidIdError('Ошибка 404 - Страницы не существует'));
});

// Обработка ошибок сервера, ошибка 500
error500(app);

console.log('status', process.env.NODE_ENV);
console.log('port', process.env.PORT);

app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 3004, () => {
});
