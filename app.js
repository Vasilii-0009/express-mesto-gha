const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const router = require('./routes/index')

const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.static(path.join((__dirname, 'public'))));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

// app.use(routerUsers);

app.use((req, res, next) => {
  req.user = {
    _id: '64074b0c6e6e523271f91c84',
  };

  next();
});

app.use(router)
// app.use(routerCards);

app.listen(PORT, () => {

});
