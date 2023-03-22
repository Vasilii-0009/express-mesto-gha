class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.messageError = message;
  }
}

module.exports = ValidationError;
