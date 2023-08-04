const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InvalidRequst = require('../errors/invalidRequest');
const NoDataError = require('../errors/noDataError');
const ServerConflictError = require('../errors/serverConflictError');
const TokenInvalidError = require('../errors/tokenInvalidError');
const {
  createUserSchema,
  updateProfileSchema,
  updateAvatarSchema,
} = require('../validate');

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new TokenInvalidError('Invalid email or password'));
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
    return next(error);
  }
};

// GET /users - возвращает всех пользователей
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return next(error);
  }
  return res.json();
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new InvalidRequst('Invalid user ID'));
    }

    const user = await User.findById(userId);

    if (user) {
      return res.json(user);
    }
    return next(new NoDataError('User not found'));
  } catch (error) {
    return next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    // Fetch the current user information from req.user (provided by the auth middleware)
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return next(new NoDataError('User not found'));
    }

    // Return the user information in the response
    return res.json(currentUser);
  } catch (error) {
    return next(error);
  }
};

// POST /users - создаёт пользователя
module.exports.createUser = async (req, res, next) => {
  const { err } = createUserSchema.validate(req.body);
  if (err) {
    return next(new InvalidRequst(err.message));
  }
  console.log(req.body);
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
      return next(new InvalidRequst(error.message));
    }
    if (error.code === 11000) {
      return next(
        new ServerConflictError('Пользователь с таким email уже существует'),
      );
    }
    return next(error);
  }
};

// PATCH /users/me — обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { err } = updateProfileSchema.validate(req.body);
  if (err) {
    return next(new InvalidRequst(err.message));
  }
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
      return next(new NoDataError('User not found'));
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      return next(error);
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { err } = updateAvatarSchema.validate(req.body);
  if (err) {
    return next(new InvalidRequst(err.message));
  }
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
      return next(new NoDataError('User not found'));
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      return next(error);
    });
};
