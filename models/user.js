const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Слишком короткое имя. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное имя. Должно быть не длиннее 30 символов.'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Слишком короткое описание. Нужно минимум 2 символа.'],
    maxlength: [30, 'Слишком длинное описание. Должно быть не длиннее 30 символов.'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[\w.\-~:/?#[\]@!$&'()*+,;=]+#?/i.test(v);
      },
      message: (props) => `${props.value} не похоже на ссылку!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email занят'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
