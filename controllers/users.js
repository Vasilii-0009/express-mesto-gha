const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// pr14
const NotFoundError = require('../utils/not-found-err');
const BadRequestError = require('../utils/bad-request-err');
const ValidationError = require('../utils/validation-err');
const DublicatError = require('../utils/duplicate-err');
const UnauthorizedError = require('../utils/unauthorized-err');

const { StatusOk, StatusOkCreat } = require('../utils/statusCode');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(StatusOk).send({ users }))
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.userId)
    .then((useris) => {
      if (useris === null) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(StatusOk).send({ data: useris });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      }
      next(err);
    });
}

function patchUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(StatusOk).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      }
      next(err);
    });
}

function patchAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => {
      if (!newAvatar) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(StatusOk).send(newAvatar);
    })
    .catch(next);
}

// pr14
function creatUser(req, res, next) {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.status(StatusOkCreat).send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      } else if (err.code === 11000) {
        next(new DublicatError('Пользователь с такими данными уже существует'));
      }
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль '));
      }

      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильные почта или пароль '));
          }

          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ user, token });
        });
    })
    .catch(next);
}

function getInfoUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  User.findById(payload._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
}

module.exports = {
  getUsers, getUser, patchUser, patchAvatar, creatUser, login, getInfoUser,
};
