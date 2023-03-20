const router = require('express').Router();
// const { ...error } = require('../utils/statusCode');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const NotFoundError = require('../utils/not-found-err');

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  // res.status(404).send({ message: `${error.ErrorUrl}` });
  throw new NotFoundError('запрос по несуществующиму адресу');
});

module.exports = router;
