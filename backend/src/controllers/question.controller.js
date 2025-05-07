const Question = require('../models/question.model');
const User = require('../models/user.model');

// @desc    Create a question (user tracker)
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { questionName, url, rating, review, solvedDate } = req.body;

    const question = await Question.create({
      questionName,
      url,
      rating,
      review,
      solvedDate,
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
    const user = await User.findById(req.user._id).populate('Questions');

    res.status(200).json({
      success: true,
      questions: user.Questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getMyQuestions,
};
