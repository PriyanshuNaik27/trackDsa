const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionName: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0
  },
  review: {
    type: String,
    default: '',
    trim: true
  },
  solvedDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
