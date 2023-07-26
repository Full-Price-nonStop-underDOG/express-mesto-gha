const Card = require("../models/card");
const router = express.Router();

// GET /cards — возвращает все карточки
router.getAllCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch cards" });
    });
};

// POST /cards — создаёт карточку
router.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  const card = new Card({ name, link, owner: _id });

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send(card))

    .catch((error) => {
      res.status(500).json({ error: "Failed to create card" });
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (deletedCard) {
        res.json(deletedCard);
      } else {
        res.status(404).json({ error: "Card not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete card" });
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
router.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User has already liked this card" });
    }

    card.likes.push(userId);
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to like card" });
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const index = card.likes.indexOf(userId);

    if (index === -1) {
      return res.status(400).json({ error: "User has not liked this card" });
    }

    card.likes.splice(index, 1);
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to dislike card" });
  }
};

module.exports = router;
