const express = require("express");
const router = express.Router();

const {
  getAllCards,
  createCard,
  deleteCard,

  likeCard,
  dislikeCard,
} = require("../controllers/cards");

// GET /cards — возвращает все карточки
router.get("/cards", getAllCards);

// POST /cards — создаёт карточку
router.post("/cards", createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/cards/:cardId", deleteCard);

router.put("/cards/:cardId/likes", likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
