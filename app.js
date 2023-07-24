const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const router = require("./routes/users");

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.use(router);

app.use((req, res, next) => {
  // Установить Content-Type для всех ответов на 'application/json'
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: "64b1700aad09705f0e106235", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
