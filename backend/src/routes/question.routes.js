const express = require('express');
const { createQuestion, getMyQuestions ,getAllTagsForUser,getQuestionsByTag} = require('../controllers/question.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/', protect, getMyQuestions);
router.get('/tags', protect, getAllTagsForUser);
router.get('/questions', protect, getQuestionsByTag);

module.exports = router;
