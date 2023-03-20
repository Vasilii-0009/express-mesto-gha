class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = 'Переданы некорректные данные при создании пользователя.(то есть некоректный id)';
  }
}

module.exports = BadRequestError;
