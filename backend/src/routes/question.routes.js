const express = require('express');
const { createQuestion, getMyQuestions ,getAllTagsForUser} = require('../controllers/question.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/', protect, getMyQuestions);
router.get('/tags', protect, getAllTagsForUser);


module.exports = router;
