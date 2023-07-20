const express = require("express");
const router = express.Router();
const {
  getUsers,
  getById,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// PATCH /users/me — обновляет профиль
router.patch("/users/me", updateProfile);
router.patch("/users", createUser);

// PATCH /users/me/avatar — обновляет аватар
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
