const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generateToken } = require('../utils/jwt');

const {
  CREATED_CODE,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserbyId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      // const noPassUser = {
      //   name: user.name,
      //   about: user.about,
      //   avatar: user.avatar,
      //   email: user.email,
      //   _id: user._id,
      // };
      res.status(CREATED_CODE).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        throw new AuthError('Неверный емеил или пароль');
      }
      return bcrypt.compare(password, foundUser.password)
        .then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            throw new AuthError('Неверный емеил или пароль');
          }
          const token = generateToken({ _id: foundUser._id });

          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            })
            .end();
        });
    })

    .catch(next);
};

module.exports.editUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  ).orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch(next);
};
