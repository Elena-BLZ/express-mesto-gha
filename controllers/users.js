const User = require('../models/user');

const {
  ERROR_CODE,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED_CODE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUserbyId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь не найден');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден', err });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.editUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  ).orFail(() => {
    const error = new Error('Пользователь не найден');
    error.statusCode = NOT_FOUND;
    throw error;
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      if (err.statusCode === NOT_FOUND || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => {
    const error = new Error('Пользователь не найден');
    error.statusCode = NOT_FOUND;
    throw error;
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      if (err.statusCode === NOT_FOUND || err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};
