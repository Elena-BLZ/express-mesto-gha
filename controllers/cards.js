const Card = require('../models/card');
const {
  CREATED_CODE,
} = require('../utils/constants');

const { errorCoder, throwNotFound } = require('../utils/helpers');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorCoder(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => errorCoder(err, res));
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => throwNotFound('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => errorCoder(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => throwNotFound('Карточка не найдена'))
    .then((likes) => res.send(likes))
    .catch((err) => errorCoder(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => throwNotFound('Карточка не найдена'))
    .then((likes) => res.send(likes))
    .catch((err) => errorCoder(err, res));
};
