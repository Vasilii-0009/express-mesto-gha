const StatusOk = 200;
const StatusOkCreat = 201;
const BadRequest = 400;
const NotFound = 404;
const InternalServerError = 500;

const ErrorUrl = 'ошибка 404: запрос по несуществующиму адресу';

module.exports = {
  BadRequest, InternalServerError, NotFound, StatusOk, StatusOkCreat, ErrorUrl
};
