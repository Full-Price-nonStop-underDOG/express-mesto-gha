const User = require("../models/user");
const mongoose = require("mongoose");

const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER_PROBLEM = 500;

// GET /users - возвращает всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: "Failed to fetch users" });
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
    res.status(ERROR_CODE_NOT_FOUND).json({ message: "Failed to fetch user" });
  }
};

// POST /users - создаёт пользователя
module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const newUser = await User.create({ name, about, avatar });

    console.log(newUser);
    res.status(201).json({ newUser });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(ERROR_CODE).json({ message: error.message });
    }
    console.log(error);
    res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: "Failed to create user" });
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
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(ERROR_CODE).json({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else {
        res
          .status(ERROR_CODE_SERVER_PROBLEM)
          .json({ message: "Failed to update profile" });
      }
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
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(ERROR_CODE).json({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else {
        res
          .status(ERROR_CODE_SERVER_PROBLEM)
          .json({ message: "Failed to update avatar" });
      }
    });
};
