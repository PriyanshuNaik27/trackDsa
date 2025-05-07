const User = require('../models/user.model');
const Question = require("../models/question.model")
const bcrypt = require('bcryptjs');


const jwt = require('jsonwebtoken');
const axios = require('axios');

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or student ID' 
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

     const user = await User.findOne({ email });
        
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password); // password check
if (!isMatch) {
  return res.status(400).json({ message: 'Invalid credentials' });
}
    // Generate JWT token 
    const token = jwt.sign(
      { 
        id: user._id,
       
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    

    return res.json({ data: { token } });
} catch (error) {
  console.error(error); // Log the error for debugging
  res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .populate('Questions');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          fullName: user.fullName,
          email: user.email,
          questions: user.Questions // Populated array of Question objects
        }
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
module.exports = {
  register,
  login,
  getProfile,

};