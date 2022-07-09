require('dotenv').config();

const { PORT = 3000 } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { loginJoi, usersJoi } = require('./middlewares/celebrate');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { errorProcessor } = require('./middlewares/error-processor');

const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginJoi, login);
app.post('/signup', usersJoi, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('Нет такого покемона');
});

app.use(errors());
app.use(errorProcessor);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
