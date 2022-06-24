const Card = require('../models/card');

const ERROR_CODE = 400;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Данные введены неверно' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('Карточка не найдена');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    const error = new Error('Карточка не найдена');
    error.statusCode = 404;
    throw error;
  })
    .then((likes) => res.status(200).send(likes))
    .catch((err) => {
      if (err.statusCode === 404 || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    const error = new Error('Карточка не найдена');
    error.statusCode = 404;
    throw error;
  })
    .then((likes) => res.status(200).send(likes))
    .catch((err) => {
      if (err.statusCode === 404 || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
