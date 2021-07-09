const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateLogin, validateCreateUser } = require('./utils/user-validators');
const { PORT, DB_URI, corsOptions } = require('./utils/constants');

const app = express();

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use(() => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).send({ message: message || 'На сервере произошла ошибка' });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
