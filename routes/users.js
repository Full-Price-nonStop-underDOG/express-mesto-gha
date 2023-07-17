const express = require("express");
const router = express.Router();
const UserRouter = require("../controllers/users");

// PATCH /users/me — обновляет профиль
router.patch("/users/me", UserRouter.updateProfile);

// PATCH /users/me/avatar — обновляет аватар
router.patch("/users/me/avatar", UserRouter.updateAvatar);

module.exports = router;
