const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER_PROBLEM = 500;

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists in the database
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    return res.json({ _id: user._id });
  } catch (error) {
    // Handle any other errors that might occur
    return res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: 'Failed to log in' });
  }
};

// GET /users - возвращает всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: 'Failed to fetch users' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getById = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(ERROR_CODE).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (user) {
      return res.json(user);
    }
    return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'User not found' });
  } catch (error) {
    return res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: 'Failed to fetch user' });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    // Fetch the current user information from req.user (provided by the auth middleware)
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Return the user information in the response
    return res.json(currentUser);
  } catch (error) {
    return res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: 'Failed to get user information' });
  }
};

// POST /users - создаёт пользователя
module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ newUser });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: error.message });
    }
    return res
      .status(ERROR_CODE_SERVER_PROBLEM)
      .json({ message: 'Failed to create user' });
  }
};

// PATCH /users/me — обновляет профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser);
      }
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ message: 'User not found' });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(ERROR_CODE).json({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ message: 'Failed to update profile' });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser);
      }
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ message: 'User not found' });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(ERROR_CODE).json({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ message: 'Failed to update avatar' });
    });
};
