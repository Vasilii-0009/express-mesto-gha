const router = require('express').Router();
const { ...error } = require('../utils/statusCode');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter)
router.use('/cards', cardRouter)
router.use((req, res) => {
  return res.status(404).send({ message: `${error.ErrorUrl}` })
})

module.exports = router;