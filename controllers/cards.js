const Card = require('../models/card');

const InvalidRequst = require('../errors/invalidRequest');
const NoDataError = require('../errors/noDataError');
// const serverConflictError = require('../errors/serverConflictError');
const createCardSchema = require('../validate');

// GET /cards — возвращает все карточки
module.exports.getAllCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => next(error));
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { err } = createCardSchema.validate(req.body);
  if (err) {
    return next(new InvalidRequst(err.message));
  }
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).json(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(
          new InvalidRequst(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(error);
    });
  return res.json();
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id; // Get the ID of the current user

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NoDataError('Card not found'));
    }

    if (String(card.owner) !== String(userId)) {
      // Check if the requesting user is the owner of the card
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this card' });
    }

    await Card.findByIdAndDelete(cardId);

    return res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new InvalidRequst('Wrong card id'));
    }
    return next(error);
  }
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = async (req, res, next) => {
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
      return next(new NoDataError('Wrong like id'));
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
      return next(
        new InvalidRequst(
          'Переданы некорректные данные при добавлении лайка карточке',
        ),
      );
    }
    return next(error);
  }
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return next(new NoDataError('Wrong like id'));
    }

    return res.status(200).json(card);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(
        new InvalidRequst(
          'Переданы некорректные данные при добавлении лайка карточке',
        ),
      );
    }
    return next(error);
  }
};
