const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const router = require("./routes/users");
const routerCards = require("./routes/cards");
const bodyParser = require("body-parser");
const cors = require("cors");
// ...
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  })
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
app.use((req, res, next) => {
  req.user = {
    _id: "64ba828ea8a3962f21b370f2", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  console.log("вывели рек", req.user);
  next();
});

app.use((req, res, next) => {
  // Установить Content-Type для всех ответов на 'application/json'
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(router);
app.use(routerCards);
