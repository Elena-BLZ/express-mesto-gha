const router = require('express').Router();
const { userInfoJoi, userIdJoi } = require('../middlewares/celebrate');

const {
  getUsers, getUserbyId, editUserProfile, editUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdJoi, getUserbyId);
router.patch('/me', userInfoJoi, editUserProfile);
router.patch('/me/avatar', userInfoJoi, editUserAvatar);

module.exports = router;
