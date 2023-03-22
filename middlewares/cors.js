// mw-cors
// Массив доменов, с которых разрешены кросс-доменные запросы
const options = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://badass.students.nomoredomains.club',
  'https://badass.students.nomoredomains.club',
  // 'https://YOUR.github.io',
];

module.exports = ((req, res, next) => {
  // Сохраняем источник запроса в переменную origin
  const { origin } = req.headers;
  // console.log(origin);

  // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];

  if (options.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
});
