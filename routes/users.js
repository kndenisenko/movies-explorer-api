const router = require('express').Router();

const { getUserInfo, patchUpdateUser } = require('../controllers/users');
const { userVAlidation } = require('../utils/userValidation');

router.get('/users/me', getUserInfo);

router.patch('/users/me', userVAlidation, patchUpdateUser);

module.exports = router;
