const User = require("../models/user");
const mongoose = require("mongoose");

const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;

// GET /users - возвращает всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch users" });
  }
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getById = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(ERROR_CODE).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(ERROR_CODE_NOT_FOUND).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch user" });
  }
};

// POST /users - создаёт пользователя
module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);

  try {
    if (!name || name.length === 0) {
      return res.status(ERROR_CODE).json({
        error: "Name is required and should not be empty",
        message: "wфыфы",
      });
    }

    if (name.length < 2 || name.length > 30) {
      return res.status(ERROR_CODE).json({
        error: "Name should be between 2 and 30 characters long",
        message: "Fвмцвм",
      });
    }

    // Add the validation for the "about" field
    if (!about || about.length === 0) {
      return res.status(ERROR_CODE).json({
        error: "About is required and should not be empty",
        message: "wымц",
      });
    }

    if (about.length < 2 || about.length > 30) {
      return res.status(ERROR_CODE).json({
        error: "About should be between 2 and 30 characters long",
        message: "Fцкмци",
      });
    }

    if (!avatar || avatar.length === 0) {
      return res.status(ERROR_CODE).json({
        error: "Avatar is required and should not be empty",
        message: "wцмц",
      });
    }

    const newUser = await User.create({ name, about, avatar });
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(ERROR_CODE).json({ message: error.message });
    }
    console.log(error);
    res.status(400).json({ error: "Failed to create user" });
  }
};
// PATCH /users/me — обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  console.log(userId);
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser);
      } else {
        res.status(ERROR_CODE_NOT_FOUND).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(400).json({ message: "Failed to update profile" });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser);
      } else {
        res.status(ERROR_CODE_NOT_FOUND).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(400).json({ message: "Failed to update avatar" });
    });
};
