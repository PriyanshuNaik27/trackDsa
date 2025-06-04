const express = require('express');
const router = express.Router();
const User = require('../models/user.model');  // import User model
const { protect } = require('../middleware/authMiddleware'); // your auth middleware that sets req.user

// GET /api/heatmap - get solved dates count per day for logged-in user
// ...existing code...
router.get('/', protect, async (req, res) => {
  try {
    // Find user and populate their Questions
    const user = await User.findById(req.user._id).populate('Questions');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const dateMap = {};
    user.Questions.forEach(q => {
      if (q.solvedDate) {
        const isoDate = new Date(q.solvedDate).toISOString().slice(0, 10); // "YYYY-MM-DD"
        dateMap[isoDate] = (dateMap[isoDate] || 0) + 1;
      }
    });

    // REMOVE THIS DEBUG LOG:
    // console.log({
    //   userName: user.fullName,
    //   questions: user.Questions,
    //   questionsLength: user.Questions.length,
    //   dateMap
    // });

    res.status(200).json({
      success: true,
      data: dateMap,
      userName: user.fullName,
      questions: user.Questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ...existing code...

module.exports = router;
