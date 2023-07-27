const express = require("express");
const Card = require("../models/card");

const mongoose = require("mongoose");

const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER_PROBLEM = 500;

// GET /cards — возвращает все карточки
module.exports.getAllCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ error: "Failed to fetch cards" });
    });
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  // if (!name || name.length < 2 || name.length > 30) {
  //   return res.status(ERROR_CODE).json({
  //     error: "Name should be between 2 and 30 characters long",
  //     message: "name is less than 2 symbols or more than 30",
  //   });
  // }

  // if (!link) {
  //   return res.status(ERROR_CODE).json({
  //     error: "You need to write link",
  //     message: "You need to write link",
  //   });
  // }

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).json({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res
          .status(ERROR_CODE_SERVER_PROBLEM)
          .json({ error: "Failed to create card" });
      }
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(cardId)) {
  //   return res
  //     .status(ERROR_CODE)
  //     .json({ error: "Invalid card ID", message: "Wrong card id" });
  // }

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (deletedCard) {
        res.json(deletedCard);
      } else {
        res
          .status(ERROR_CODE)
          .json({ error: "Card not found", message: "Wrong card id" });
      }
    })
    .catch((error) => {
      res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ error: "Failed to delete card" });
    });
};
// PUT /cards/:cardId/likes — поставить лайк карточке

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // if (!mongoose.Types.ObjectId.isValid(cardId)) {
  //   return res
  //     .status(ERROR_CODE)
  //     .json({ error: "Invalid card ID", message: "Wrong like id" });
  // }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!card) {
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ error: "Card not found", message: "Wrong like id" });
    }

    // if (card.likes.includes(userId)) {
    //   return res.status(ERROR_CODE).json({
    //     error: "User has already liked this card",
    //     message: "Incorrect like id",
    //   });
    // }

    card.likes.push(userId);
    await card.save();

    res.status(200).json(card);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(ERROR_CODE).json({
        message: "Переданы некорректные данные при добавлении лайка карточке",
      });
    } else {
      res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ error: "Failed to like card" });
    }
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // if (!mongoose.Types.ObjectId.isValid(cardId)) {
  //   return res
  //     .status(ERROR_CODE)
  //     .json({ error: "Invalid card ID", message: "Wrong like id" });
  // }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!card) {
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ error: "Card not found", message: "Wrong like id" });
    }

    const index = card.likes.indexOf(userId);

    if (index === -1) {
      return res.status(ERROR_CODE).json({
        error: "User has not liked this card",
        message: "Incorrect like id",
      });
    }

    card.likes.splice(index, 1);
    await card.save();

    res.json(card);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(ERROR_CODE).json({
        message: "Переданы некорректные данные при удалении лайка карточки",
      });
    } else {
      res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ error: "Failed to dislike card" });
    }
  }
};
