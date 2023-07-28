const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_SERVER_PROBLEM = 500;

// GET /cards — возвращает все карточки
module.exports.getAllCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch(() => {
      res
        .status(ERROR_CODE_SERVER_PROBLEM)
        .json({ message: 'Failed to fetch cards' });
    });
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).json(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).json({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(ERROR_CODE_SERVER_PROBLEM).json({ message: 'Failed to create card' });
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(cardId)) {
  //   return res.status(ERROR_CODE).json({ message: 'Wrong card id' });
  // }

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (deletedCard) {
        return res.json(deletedCard);
      }
      return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Wrong card id' });
    })
    .catch(() => res.status(ERROR_CODE_SERVER_PROBLEM).json({
      message: 'Deleting a card with an incorrect id',
    }));
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // if (!mongoose.Types.ObjectId.isValid(cardId)) {
  //   return res
  //     .status(ERROR_CODE)
  //     .json({ error: 'Invalid card ID', message: 'Wrong like id' });
  // }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ message: 'Wrong like id' });
    }

    // if (card.likes.includes(userId)) {
    //   return res.status(ERROR_CODE).json({
    //     error: 'User has already liked this card',
    //     message: 'Incorrect like id',
    //   });
    // }

    return res.status(200).json(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE).json({
        message: 'Переданы некорректные данные при добавлении лайка карточке',
      });
    }
    return res.status(ERROR_CODE_SERVER_PROBLEM).json({ message: 'Failed to like card' });
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res
        .status(ERROR_CODE_NOT_FOUND)
        .json({ message: 'Wrong like id' });
    }

    const index = card.likes.indexOf(userId);

    card.likes.splice(index, 1);
    await card.save();

    return res.status(200).json(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE).json({
        message: 'Переданы некорректные данные при удалении лайка карточки',
      });
    }
    return res.status(ERROR_CODE_SERVER_PROBLEM).json({ message: 'Failed to dislike card' });
  }
};
