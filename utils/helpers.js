const {
  ERROR_CODE,
  NOT_FOUND,
  SERVER_ERROR,
} = require('./constants');

module.exports.errorCoder = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).send({ message: err.message });
    return;
  }
  if (err.statusCode === NOT_FOUND) {
    res.status(NOT_FOUND).send({ message: err.message });
    return;
  }
  if (err.name === 'CastError') {
    res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
    return;
  }
  res.status(SERVER_ERROR).send({ message: err.message });
};

module.exports.throwNotFound = (message) => {
  const error = new Error(message);
  error.statusCode = NOT_FOUND;
  throw error;
};
