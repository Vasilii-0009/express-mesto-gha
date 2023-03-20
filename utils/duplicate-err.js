class DublicatError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.messageError = message;
  }
}

module.exports = DublicatError;
