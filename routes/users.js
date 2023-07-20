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

// PATCH /users/me/avatar — обновляет аватар
router.patch("/users/me/avatar", updateAvatar);

// GET /users - возвращает всех пользователей
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers(); // Используем функцию getUsers, которую импортировали из контроллера
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users/:userId - возвращает пользователя по _id
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getById(userId); // Используем функцию getById из контроллера
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /users - создаёт пользователя
router.post("/users", async (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  try {
    const newUser = await createUser(name, about, avatar); // Используем функцию createUser из контроллера
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
