const StatusOk = 200;
const StatusOkCreat = 201;
const BadRequest = 400;
const Unauthorized = 401;
const NotFound = 404;
const Conflict = 409;
const InternalServerError = 500;

const ErrorUrl = 'ошибка 404: запрос по несуществующиму адресу';

module.exports = {
  BadRequest,
  Unauthorized,
  InternalServerError,
  NotFound,
  StatusOk,
  StatusOkCreat,
  ErrorUrl,
  Conflict,
};
