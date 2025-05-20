const express = require('express');
const router = express.Router();
const { register, login, getProfile} = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { logout } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/users/profile', protect, getProfile);
router.post('/logout', logout);

module.exports = router;