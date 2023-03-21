const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const router = require('./routes/index');

// pr14
const { creatUser, login } = require('./controllers/users');
const erro = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/\w{1,}/),
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), creatUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(router);

app.use(errors());
app.use(erro);
app.listen(PORT, () => {

});
