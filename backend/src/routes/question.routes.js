const express = require('express');
const { createQuestion, getMyQuestions } = require('../controllers/question.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/', protect, getMyQuestions);

module.exports = router;
