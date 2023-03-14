const router = require('express').Router();

const {
  createCard, getCards, deleteCard, putCardLikes, putDeleteLikes,
} = require('../controllers/cards');

router.post('/', createCard);

router.get('/', getCards);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putCardLikes);

router.delete('/:cardId/likes', putDeleteLikes);

module.exports = router;
