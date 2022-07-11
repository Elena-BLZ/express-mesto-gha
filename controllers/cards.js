const Card = require('../models/card');
const {
  CREATED_CODE,
} = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const RequestError = require('../errors/request-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(err.message));
      }
      next(err);
    });
};

module.exports.delCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .then((foundCard) => {
      if (foundCard.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Карточку может удалить только ее владелец');
      }
      Card.deleteOne(foundCard)
        .then(() => res.send(foundCard));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Данные введены неверно'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Данные введены неверно'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => { throw new NotFoundError('Карточка не найдена'); })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Данные введены неверно'));
      }
      next(err);
    });
};
