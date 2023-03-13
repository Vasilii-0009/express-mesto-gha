const router = require('express').Router();

const {
  createCard, getCards, deleteCard, putCardLikes, putDeleteLikes,
} = require('../controllers/cards');

router.post('/cards', createCard);

router.get('/card', getCards);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putCardLikes);

router.delete('/cards/:cardId/likes', putDeleteLikes);

module.exports = router;
