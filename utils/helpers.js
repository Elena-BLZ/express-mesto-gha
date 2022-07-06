const {
  ERROR_CODE,
  NOT_FOUND,
  SERVER_ERROR,
  EMAIL_CONFLICT,
} = require('./constants');

module.exports.errorCoder = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).send({ message: err.message });
    return;
  }
  if (err.statusCode === NOT_FOUND) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.code === 11000) {
    res.status(EMAIL_CONFLICT).send({ message: 'Email занят' });
    return;
  }
  if (err.name === 'CastError') {
    res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
    return;
  }
  res.status(SERVER_ERROR).send({ message: err.message });
};
