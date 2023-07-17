const express = require("express");
const router = express.Router();
const cardController = require("../controllers/сards");

// GET /cards — возвращает все карточки
router.get("/cards", cardController.getAllCards);

// POST /cards — создаёт карточку
router.post("/cards", cardController.createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/cards/:cardId", cardController.deleteCard);

router.put("/cards/:cardId/likes", CardController.likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete("/cards/:cardId/likes", CardController.dislikeCard);

module.exports = router;
