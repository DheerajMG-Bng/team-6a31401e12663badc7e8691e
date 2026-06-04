const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// GENERATE JWT TOKEN
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

// COMPARE PASSWORDS
const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// REGISTER FUNCTION
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({
        success : false,
        message : 'User already exists'
      });
    }

    // CREATE USER AND GENERATE TOKEN
    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success : true,
      token,
      user : {
        id : user._id,
        name,
        email,
        role : user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success : false,
      message : err.message
    });
  }
};

// LOGIN FUNCTION 
const login = async (req, res) => {
  try{
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email }).select('+password');
    if(!user) {
      return res.status(401).json({
        success : false,
        message : 'Invalid credentials'
      });
    }

    // CHECK PASSWORD
    const isMatch = await matchPassword(password, user.password);
    if(!isMatch) {
      return res.status(401).json({
        success : false,
        message : 'Invalid credentials'
      });
    }

    // GENERATE TOKEN
    const token = generateToken(user);

    res.status(200).json({
      success : true,
      token,
      user : {
        id : user._id,
        name : user.name,
        email,
        role : user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success : false,
      message : err.message
    });
  }
};

// PROTECT MIDDLEWARE - CHECKS IF USER IS LOGGED IN OR NOT
const protect = async (req, res, next) => {
  let token;
  
  // AUTHORIZATION - EXTRACT THE TOKEN FROM CLIENT
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // CHECK IF TOKEN EXISTS
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }
  
  try {

    // DECODE THE TOKEN INTO USER INFORMATION
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    // CHECK WHETHER USER STILL EXISITS OR NOT
    if(!user) {
      return res.status(401).json({
        success : false,
        message : 'User not found'
      });
    }

    // ATTACHING USER TO REQUEST OBJECT FOR FURTHER CONTROLLERS
    req.user = user;
    req.user_id = user._id;
    req.user_role = user.role; 
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// AUTHORIZE MIDDLEWARE - CHECKS IF USER HAS REQUIRED ROLE OR NOT
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${req.user.role} role not allowed ` 
      });
    }
    next();
  };
};

module.exports = {
  register,
  login,
  protect,
  authorize
}

