const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Нужно ввести Имя пользователя.'],
    minlength: [2, 'Слишком короткое имя. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное имя. Должно быть не длиннее 30 символов.'],
  },
  about: {
    type: String,
    required: [true, 'Нужно ввести Описание.'],
    minlength: [2, 'Слишком короткое описание. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное описание. Должно быть не длиннее 30 символов.'],
  },
  avatar: {
    type: String,
    required: [true, 'Нужна ссылка на аватар.'],
  },
});

module.exports = mongoose.model('user', userSchema);
