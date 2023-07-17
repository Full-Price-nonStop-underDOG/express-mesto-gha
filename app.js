const express = require("express");
const app = express();
const User = require("./models/user");
const router = require("./routes/users");

app.use(express.json());

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: "64b1700aad09705f0e106235", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
