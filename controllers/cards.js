const Card = require('../models/card');
const {
  ERROR_CODE,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED_CODE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('Карточка не найдена');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    const error = new Error('Карточка не найдена');
    error.statusCode = NOT_FOUND;
    throw error;
  })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    const error = new Error('Карточка не найдена');
    error.statusCode = NOT_FOUND;
    throw error;
  })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};
