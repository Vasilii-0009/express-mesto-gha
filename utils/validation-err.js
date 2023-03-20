class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = 'Поля заполнины не коректно';
  }
}

module.exports = ValidationError;
