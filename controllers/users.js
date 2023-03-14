const User = require('../models/user');

const {
  BadRequest, InternalServerError, NotFound, StatusOk,
} = require('../utils/statusCode');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(StatusOk).send({ users }))
    .catch((err) => res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` }));
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .then((useris) => {
      if (useris === null) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.status(StatusOk).send({ data: useris })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: `Некоректный id, произошла ошибка ${err.name}` })
      }
      res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
    });
}

function creatUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(StatusOk).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: `Переданы некорректные данные при создании пользователя, произошла ошибка ${err.name}` });
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}

function patchUser(req, res) {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.status(StatusOk).send(newUser)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: `Переданы некорректные данные при обновлении профиля, произошла ошибка ${err.name}` });
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}

function patchAvatar(req, res) {
  const { avatar } = req.body
  User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => {
      if (!newAvatar) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.status(StatusOk).send(newAvatar)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: `Переданы некорректные данные при обновлении профиля, произошла ошибка ${err.name}` });
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}


module.exports = {
  getUsers, getUser, creatUser, patchUser, patchAvatar,
};
