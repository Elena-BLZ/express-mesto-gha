const {
// ERROR_CODE,
  SERVER_ERROR,
// EMAIL_CONFLICT,
} = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports.errorProcessor = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });

  // обрабатываем все кастомныеклассы ошибок
  // if (err.statusCode) {
  //   res.status(err.statusCode).send({ message: err.message });
  //   return;
  // }

  // обрабатываем ошибки от валидатора
  // if (err.name === 'ValidationError') {
  //   res.status(ERROR_CODE).send({ message: err.message });
  //   return;
  // }

  // обрабатываем ошибку от Mongo про уникальный email
  // if (err.code === 11000) {
  //   res.status(EMAIL_CONFLICT).send({ message: 'Email занят' });
  //   return;
  // }

  // if (err.name === 'CastError') {
  //   res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
  //   return;
  // }
  // res.status(SERVER_ERROR).send({ message: err.message });
};
