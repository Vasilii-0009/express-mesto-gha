const router = require('express').Router();

// pr14
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, patchUser, patchAvatar, getInfoUser,
} = require('../controllers/users');

router.get('/', getUsers);

// pr14
router.get('/me', celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
    authorization: Joi.string().required(),
  }).unknown(true),
}), getInfoUser);
// pr14

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.patch('/me/:_id', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

router.patch('/me/avatar/:_id', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), patchAvatar);

module.exports = router;
