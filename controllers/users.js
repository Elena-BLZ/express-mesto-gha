const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generateToken } = require('../utils/jwt');

const {
  CREATED_CODE,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ConflictError = require('../errors/conflict-err');
const RequestError = require('../errors/request-err');

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
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Данные введены неверно'));
      } else { next(err); }
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
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
  User.findOne({ email })
    .then((found) => {
      if (found) { throw new ConflictError('Такой емеил уже занят'); }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => {
          const noPassUser = {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          };
          res.status(CREATED_CODE).send(noPassUser);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой емеил уже занят'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
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
              sameSite: 'none',
              secure: true,
            })
            .send({ message: 'Авторизация прошла успешно' });
        });
    })
    .catch(next);
};

module.exports.logOut = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
    .send({ message: 'Пока-пока!' })
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else { next(err); }
    });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      } else { next(err); }
    });
};
