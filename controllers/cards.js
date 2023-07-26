const express = require("express");
const Card = require("../models/card");
const router = express.Router();
const mongoose = require("mongoose");

// GET /cards — возвращает все карточки
module.exports.getAllCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch cards" });
    });
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).json({
      error: "Name should be between 2 and 30 characters long",
      message: "name is less than 2 symbols or more than 30",
    });
  }

  if (!link) {
    return res.status(400).json({
      error: "You need to write link",
      message: "You need to write link",
    });
  }

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      res.status(500).json({ error: "Failed to create card" });
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const mongoose = require("mongoose");

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(400)
      .json({ error: "Invalid card ID", message: "Wrong card id" });
  }

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (deletedCard) {
        res.json(deletedCard);
      } else {
        res
          .status(400)
          .json({ error: "Card not found", message: "Wrong card id" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete card" });
    });
};

// delete /cards/:cardId/likes — удалить лайк карточке
module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(400)
      .json({ error: "Invalid card ID", message: "Wrong like id" });
  }

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res
        .status(400)
        .json({ error: "Card not found", message: "Wrong like id" });
    }

    const index = card.likes.indexOf(userId);

    if (index === -1) {
      return res.status(400).json({
        error: "User has not liked this card",
        message: "Incorrect like id",
      });
    }

    card.likes.splice(index, 1);
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Failed to dislike card" });
  }
};
