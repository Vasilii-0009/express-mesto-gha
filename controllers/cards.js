const Card = require('../models/card');
const {
  BadRequest, InternalServerError, NotFound, StatusOk, StatusOkCreat,
} = require('../utils/statusCode');

// pr14
const NotFoundError = require('../utils/not-found-err');
const BadRequestError = require('../utils/bad-request-err');
const ValidationError = require('../utils/validation-err');
const DublicatError = require('../utils/duplicate-err');
const UnauthorizedError = require('../utils/unauthorized-err');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = req.user._id;
  Card.create({ name, link, owner, likes })
    .then((card) => res.status(StatusOkCreat).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send(new ValidationError());
      }
      next(err);
    });
}

function getCards(req, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(StatusOk).send({ cards });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((user) => {
      if (user === null || !user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      const paramsId = req.user._id.toString();
      const cardId = user.owner.toString();
      if (paramsId === cardId) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            res.send({ data: card });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

function putCardLikes(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((putLikes) => {
      if (putLikes === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(StatusOk).send({ data: putLikes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

function putDeleteLikes(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((deletelikes) => {
      if (deletelikes === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(StatusOk).send({ data: deletelikes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send(new BadRequestError());
      }
      next(err);
    });
}

module.exports = {
  createCard, getCards, deleteCard, putCardLikes, putDeleteLikes,
};
