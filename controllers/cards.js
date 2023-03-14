const Card = require('../models/card');
const {
  BadRequest, InternalServerError, NotFound, StatusOk, StatusOkCreat
} = require('../utils/statusCode');

function createCard(req, res) {
  const { name, link, } = req.body;
  const owner = req.user._id;
  const likes = req.user._id;
  Card.create({ name, link, owner, likes })
    .then((card) => res.status(StatusOkCreat).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: `Переданы некорректные данные при создании пользователя, произошла ошибка ${err.name}` });
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}

function getCards(req, res) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      console.log(cards.id)
      res.status(StatusOk).send({ cards })
    })
    .catch((err) => res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` }));
}

function deleteCard(req, res) {
  console.log(req.params.cardId)
  console.log(req.params._id)
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (card === null || !card) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: `Некоректный id, произошла ошибка ${err.name}` })
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    })
}

function putCardLikes(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((putLikes) => {
      if (putLikes === null) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.status(StatusOk).send({ data: putLikes })
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: `Некоректный id, произошла ошибка ${err.name}` })
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}

function putDeleteLikes(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((deletelikes) => {
      if (deletelikes === null) {
        return res.status(NotFound).send({ message: `Пользователь по указанному _id не найден, произошла ошибка ${err.name}` });
      }
      res.status(StatusOk).send({ data: deletelikes })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: `Некоректный id, произошла ошибка ${err.name}` })
      } else {
        res.status(InternalServerError).send({ message: `Произошла ошибка ${err.name}` })
      }
    });
}

module.exports = {
  createCard, getCards, deleteCard, putCardLikes, putDeleteLikes,
};
