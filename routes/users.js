const router = require('express').Router();

const {
  getUsers, getUserbyId, createUser, editUserProfile, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserbyId);
router.post('/', createUser);
router.patch('/me', editUserProfile);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
