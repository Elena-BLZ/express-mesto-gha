const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserbyId, createUser, editUserProfile, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserbyId);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.patch('/me', editUserProfile);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
