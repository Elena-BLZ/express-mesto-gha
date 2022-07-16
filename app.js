require('dotenv').config();

const { PORT = 3001 } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { loginJoi, usersJoi } = require('./middlewares/celebrate');
const { auth } = require('./middlewares/auth');
const { login, logOut, createUser } = require('./controllers/users');
const { errorProcessor } = require('./middlewares/error-processor');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    'http://localhost:3000',
    'https://ваш-домен',
    'https://your-name-of.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use('*', cors(options));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', loginJoi, login);
app.post('/signup', usersJoi, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/logout', logOut);

app.use(() => {
  throw new NotFoundError('Нет такого покемона');
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorProcessor);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
