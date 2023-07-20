const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET /users - возвращает всех пользователей
module.exports.getUsers =
  ("/users",
  async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

// GET /users/:userId - возвращает пользователя по _id
module.exports.getById =
  ("/users/:userId",
  async (req, res) => {
    const { userId } = bodyParserreq.params;
    try {
      const user = await User.findById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
    п;
  });

// POST /users - создаёт пользователя
module.exports.createUser =
  ("/users",
  async (req, res) => {
    const { name, about, avatar } = req.body;
    console.log(req.body);
    try {
      const newUser = await User.create({ name, about, avatar });
      console.log(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update profile" });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update avatar" });
    });
};
