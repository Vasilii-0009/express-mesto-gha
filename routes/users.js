const router = require('express').Router();
const {
  getUsers, getUser, creatUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', creatUser);

router.patch('/users/me/:_id', patchUser);

router.patch('/users/me/avatar/:_id', patchAvatar);

module.exports = router;
