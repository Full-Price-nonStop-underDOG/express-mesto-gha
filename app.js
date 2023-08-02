const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const router = require('./routes/users');
const routerCards = require('./routes/cards');
const authMiddleware = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(3000, () => {});
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64c1194f6128cbaa7041d519', //
//   };

//   next();
// });

app.use((req, res, next) => {
  if (req.url === '/signup' || req.url === '/signin') {
    next(); // Skip auth for signup and signin
  } else {
    authMiddleware(req, res, next); // Apply authMiddleware for other routes
  }
});

app.use(router);
app.use(routerCards);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});
