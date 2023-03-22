const Card = require('../models/card');
const { StatusOk, StatusOkCreat } = require('../utils/statusCode');

// pr14
const NotFoundError = require('../utils/not-found-err');
const ValidationError = require('../utils/validation-err');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = req.user._id;
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.status(StatusOkCreat).send(card))
    .catch((err) => {
      const resCode = (err.name === 'ValidationError') ? next(new ValidationError('Поля заполнины не коректно')) : next(err);
      return resCode;
    });
}

function getCards(req, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(StatusOk).send({ cards });
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((user) => {
      if (user === null || !user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      const paramsId = req.user._id.toString();
      const cardId = user.owner.toString();
      if (paramsId === cardId) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            res.send({ data: card });
          });
      } else {
        return next(new NotFoundError('У вас нет прав для удаления данной карточки'));
      }
    })
    .catch((err) => {
      const resCode = (err.name === 'CastError') ? next(new ValidationError('Переданы некорректные данные при создании пользователя.(то есть некоректный id)')) : next(err);
      return resCode;
    });
}

function putCardLikes(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((putLikes) => {
      if (putLikes !== null) {
        res.status(StatusOk).send({ data: putLikes });
      }
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .catch((err) => {
      const resCode = (err.name === 'CastError') ? next(new ValidationError('Переданы некорректные данные при создании пользователя.(то есть некоректный id)')) : next(err);
      return resCode;
    });
}

function putDeleteLikes(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((deletelikes) => {
      if (deletelikes !== null) {
        res.status(StatusOk).send({ data: deletelikes });
      }
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .catch((err) => {
      const resCode = (err.name === 'CastError') ? next(new ValidationError('Переданы некорректные данные при создании пользователя.(то есть некоректный id)')) : next(err);
      return resCode;
    });
}

module.exports = {
  createCard, getCards, deleteCard, putCardLikes, putDeleteLikes,
};
