const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/unauthorized-err');

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;

  next();
};

module.exports = auth;
