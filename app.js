const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
