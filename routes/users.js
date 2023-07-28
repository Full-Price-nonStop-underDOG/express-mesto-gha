const express = require('express');

const router = express.Router();
const {
  getUsers,
  getById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// GET /users - возвращает всех пользователей
router.get('/users', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get('/users/:userId', getById);

// POST /users - создаёт пользователя
router.post('/users', createUser);

// PATCH /users/me — обновляет профиль
router.patch('/users/me', updateProfile);

// PATCH /users/me/avatar — обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
