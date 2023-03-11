const User = require('../models/user');

const {
  BadRequest, InternalServerError, NotFound, StatusOk,
} = require('../utils/statusCode');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(StatusOk).send({ users }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании пользователя, произошла ошибка 400' });
      }
    });
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('user not found');
    })
    .then((useris) => res.status(StatusOk).send({ data: useris }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден, произошла ошибка 404' });
      }
    });
  console.log(User);
}

function creatUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(StatusOk).send(user))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании пользователя, произошла ошибка 400' });
      }
    });
}

function patchUser(req, res) {
  User.findByIdAndUpdate(req.params._id, {
    name: [1, 23, 3],
    about: 'web-developer',
  })
    .then((newUser) => res.status(StatusOk).send(newUser))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else if (err.valueType !== 'string') {
        res.status(BadRequest).send({ message: ' Переданы некорректные данные при обновлении профиля, произошла ошибка 400' });
      } else if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден, произошла ошибка 404' });
      }
    });
}

function patchAvatar(req, res) {
  User.findByIdAndUpdate(req.params._id, {
    avatar: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
  })
    .then((newAvatar) => res.status(StatusOk).send(newAvatar))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else if (err.valueType !== 'string') {
        res.status(BadRequest).send({ message: ' Переданы некорректные данные при обновлении аватара, произошла ошибка 400' });
      } else if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Пользователь с указанным _id не найден, произошла ошибка 404' });
      }
    });
}

module.exports = {
  getUsers, getUser, creatUser, patchUser, patchAvatar,
};
