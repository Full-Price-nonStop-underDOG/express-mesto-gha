const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Урсула Ле Гуин',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Писатель',
  },
  avatar: {
    type: String,
    required: true,
    default:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstoryport.online%2Fpoznakomitsya-s-avtorom%2Fvelikaya-skazochnitsa-za-chto-my-lyubim-ursulu-le-guin%2F&psig=AOvVaw25eYgaS3D6yhZgKP6GG1Gq&ust=1690917082219000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOD2hpLTuYADFQAAAAAdAAAAABAE',
  },
  email: {
    type: String,
    required: true,
    unique: true, // Устанавливаем, что email должен быть уникальным
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
