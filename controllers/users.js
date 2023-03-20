const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// pr14
const NotFoundError = require('../utils/not-found-err');
const BadRequestError = require('../utils/bad-request-err');
const ValidationError = require('../utils/validation-err');
const DublicatError = require('../utils/duplicate-err');
const UnauthorizedError = require('../utils/unauthorized-err');

const {
  BadRequest, Unauthorized, InternalServerError, NotFound, StatusOk, StatusOkCreat, Conflict,
} = require('../utils/statusCode');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(StatusOk).send({ users }))
    .catch((err) => {
      next(err);
    });
}

function getUser(req, res, next) {
  User.findById(req.params.userId)
    .then((useris) => {
      if (useris === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(StatusOk).send({ data: useris });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

function patchUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(StatusOk).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send(new ValidationError());
      } else if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

function patchAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => {
      if (!newAvatar) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(StatusOk).send(newAvatar);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

// pr14
function creatUser(req, res, next) {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(StatusOkCreat).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send(new ValidationError());
      } else if (err.code === 11000) {
        return res.status(409).send(new DublicatError({ message: `Пользователь с такими данными уже существует: ${err.message}` }));
      }
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          // аутентификация успешна
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ user, token });
        });
    })
    .catch((err) => {
      next(err);
    });
}

function getInfoUser(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация');
  }
  User.findById(payload._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getUsers, getUser, patchUser, patchAvatar, creatUser, login, getInfoUser,
};
