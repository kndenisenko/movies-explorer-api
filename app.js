// Dependencies from NPM
const express = require('express');
const dotenv = require('dotenv');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes');

// User's dependencies
const cors = require('./middlewares/cors');
const rateLimit = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { NODE_ENV, PORT, MONGO_BASE } = process.env;

const { NoFoundError } = require('./errors/NoFoundError');
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

app.use(cors);

// Подключаем логгер запросов
app.use(requestLogger);

// Подключаем логгер ошибок
app.use(errorLogger);

// Используем helmet и body parser
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД moongoose
mongoose.set('strictQuery', false); // убираем warning из консоли при старте
mongoose.connect(process.env.MONGO_BASE);

route(app);

// Обработка ошибок celebrate
app.use(errors(app.err));

// Обработка ошибок сервера, ошибка 500
error500(app);

console.log('status', process.env.NODE_ENV);
console.log('port', process.env.PORT);

app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 3004, () => {
});
