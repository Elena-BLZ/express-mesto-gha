const router = require('express').Router();
const { cardsJoi, cardIdJoi } = require('../middlewares/celebrate');

const {
  getCards, createCard, delCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', cardIdJoi, delCard);
router.post('/', cardsJoi, createCard);
router.put('/:cardId/likes', cardIdJoi, likeCard);
router.delete('/:cardId/likes', cardIdJoi, dislikeCard);

module.exports = router;
