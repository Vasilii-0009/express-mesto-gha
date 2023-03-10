const Card = require('../models/card');
const {
  BadRequest, InternalServerError, NotFound, StatusOk,
} = require('../utils/statusCode');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(StatusOk).send(card))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании карточки, произошла ошибка 400' });
      }
    });
}

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.status(StatusOk).send({ cards }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании карточки, произошла ошибка 400' });
      }
    });
}

function getCard(req, res) {
  Card.findById(req.params.cardId)
    .then((card) => res.status(StatusOk).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(NotFound).send({ message: ' Карточка с указанным _id не найдена, произошла ошибка 404' });
      }
    });
}

function putCardLikes(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((putLikes) => res.status(StatusOk).send({ data: putLikes }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else if (err.valueType !== 'string') {
        res.status(BadRequest).send({ message: ' Переданы некорректные данные для постановки/снятии лайка, произошла ошибка 400' });
      } else if (err.name === 'CastError') {
        res.status(NotFound).send({ message: 'Передан несуществующий _id карточки, произошла ошибка 404' });
      }
    });
}

function putDeleteLikes(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((deletelikes) => res.status(StatusOk).send({ data: deletelikes }))
    .catch((err) => {
      if (err.name === 'ReferenceError') {
        res.status(InternalServerError).send({ message: 'Произошла ошибка 500' });
      } else {
        res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена, произошла ошибка 404' });
      }
    });
}

module.exports = {
  createCard, getCards, getCard, putCardLikes, putDeleteLikes,
};
