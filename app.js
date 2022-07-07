require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { usersJoi } = require('./utils/celebrate');

const {
  NOT_FOUND,
} = require('./utils/constants');

const { errorCoder } = require('./utils/helpers');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '62b4a1711d079819bc2abebb',
  };
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
// app.post('/signup', usersJoi, createUser);
app.post('/signup', createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Нет такого покемона' });
});

app.use(errors());

app.use((err, req, res, next) => {
  errorCoder(err, res);
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
