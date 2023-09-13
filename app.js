const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./logger');

const app = express();

const router = require('./routes/users');
const routerCards = require('./routes/cards');
const authMiddleware = require('./middlewares/auth');
const NoDataError = require('./errors/noDataError');

const { login, createUser } = require('./controllers/users');

app.use(cookieParser());

const urlRegex =
  /^(https?:\/\/)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(:\d{2,5})?(\/[^\s]*)?$/;

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(3001, () => {});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use((req, res, next) => {
  if (req.url === '/signup' || req.url === '/signin') {
    next(); // Skip auth for signup and signin
  } else {
    authMiddleware(req, res, next); // Appply authMiddleware for other route
  }
});
app.use(requestLogger);
app.use(router);
app.use(routerCards);
// router.use((req, res, next) =>
//   next(new NoDataError('Страницы по запрошенному URL не существует'))
// );

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(urlRegex),
    }),
  }),
  createUser
);
app.use(errorLogger);
app.use(errors());

app.use('*', (req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  // Логируем ошибку

  // Отправляем ошибку клиенту
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? `На сервере произошла ошибка: ${err.message}`
      : err.message;

  res.status(statusCode).json({ message });
});
