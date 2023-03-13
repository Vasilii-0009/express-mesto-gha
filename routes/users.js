const router = require('express').Router();
const {
  getUsers, getUser, creatUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', creatUser);

router.patch('/me/:_id', patchUser);

router.patch('/me/avatar/:_id', patchAvatar);

// router.get('*', function (req, res) {
//   return res.status(404).send({ message: `Несуществующий маршрут, произошла ошибка 404` });
// })

module.exports = router;
