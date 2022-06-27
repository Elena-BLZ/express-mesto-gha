const User = require('../models/user');

const {
  NOT_FOUND,
  CREATED_CODE,
} = require('../utils/constants');

const { errorCoder, throwNotFound } = require('../utils/helpers');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorCoder(err, res));
};

module.exports.getUserbyId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => throwNotFound('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => errorCoder(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send(user))
    .catch((err) => errorCoder(err, res));
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
  ).orFail(() => throwNotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => errorCoder(err, res));
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
  ).orFail(() => throwNotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => errorCoder(err, res));
};

module.exports.throwNotFound = (message) => {
  const error = new Error(message);
  error.statusCode = NOT_FOUND;
  throw error;
};
