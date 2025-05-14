const Question = require('../models/question.model');
const User = require('../models/user.model');

// @desc    Create a question (user tracker)
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { questionName, url, rating, review, solvedDate,tags } = req.body;
    if (!Array.isArray(tags)) {
      return res.status(400).json({ success: false, message: 'Tags must be an array' });
    }

    const question = await Question.create({
      questionName,
      url,
      rating,
      review,
      solvedDate,
      tags,
    });

    // Add to user's tracker
    const user = await User.findById(req.user._id);
    user.Questions.push(question._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Question added to tracker',
      data: question,
    });
  } catch (error) {
     console.error('Error saving question:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all questions for logged-in user
// @route   GET /api/questions
// @access  Private
const getMyQuestions = async (req, res) => {
  try {
    const tag = req.query.tag;
    const user = await User.findById(req.user._id).populate({
      path: 'Questions',
      match: tag ? {tags:tag} :{},
    });

    res.status(200).json({
      success: true,
      data: user.Questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ @desc    Get all unique tags for the logged-in user
// ✅ @route   GET /api/questions/tags
// ✅ @access  Private
const getAllTagsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('Questions');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Flatten all tags from user's questions
    const allTags = user.Questions.flatMap(q => q.tags || []);
    const uniqueTags = [...new Set(allTags.map(tag => tag.toLowerCase().trim()))];

    res.status(200).json({
      success: true,
      tags: uniqueTags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// @desc    Get all questions by tag
// @route   GET /api/questions/:tag
// @access  Private
const getQuestionsByTag = async (req, res) => {
  try {
    const { tag } = req.query;  // Use req.query for query parameters
    if (!tag) {
      return res.status(400).json({ success: false, message: 'Tag is required' });
    }
    
    const questions = await Question.find({ tags: tag });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this tag' });
    }
    
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions by tag:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}


module.exports = {
  createQuestion,
  getMyQuestions,
  getAllTagsForUser, 
  getQuestionsByTag,
};