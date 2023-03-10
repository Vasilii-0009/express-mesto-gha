const router = require('express').Router();

const {
  createCard, getCards, getCard, putCardLikes, putDeleteLikes,
} = require('../controllers/cards');

router.post('/cards', createCard);

router.get('/card', getCards);

router.get('/cards/:cardId', getCard);

router.put('/cards/:cardId/likes', putCardLikes);

router.delete('/cards/:cardId/likes', putDeleteLikes);

module.exports = router;
