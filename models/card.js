const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Нужно ввести Название.'],
    minlength: [2, 'Слишком короткое название. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное название. Должно быть не длиннее 30 символов.'],
  },
  link: {
    type: String,
    required: [true, 'Нужна ссылка на картинку.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,

  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
