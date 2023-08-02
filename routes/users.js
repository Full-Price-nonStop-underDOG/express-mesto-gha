const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const {
  getUsers,
  getById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', authMiddleware, getCurrentUser);
// GET /users - возвращает всех пользователей
router.get('/users', getUsers);

// GET /users/:userId - возвращает пользователя по _id
router.get('/users/:userId', getById);

// POST /users - создаёт пользователя

// PATCH /users/me — обновляет профиль
router.patch('/users/me', updateProfile);

// PATCH /users/me/avatar — обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
