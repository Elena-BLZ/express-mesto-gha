const router = require('express').Router();

const {
  getUsers, getUserbyId, editUserProfile, editUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserbyId);
router.patch('/me', editUserProfile);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
