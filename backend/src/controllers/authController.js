// src/controllers/authController.js
require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic pre-check
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    // Duplicate email
    if (err.name === 'SequelizeUniqueConstraintError') {
      console.error('🔴  Duplicate email:', err);
      return res.status(409).json({ message: 'Email already in use' });
    }
    // Validation errors (e.g. invalid format, DB constraints)
    if (err.name === 'SequelizeValidationError') {
      console.error('🔴  Validation errors:', err);
      const messages = err.errors.map(e => e.message).join(', ');
      return res.status(400).json({ message: messages });
    }

    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed, please try again.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic pre-check
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      expiresIn: 3600
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed, please try again.' });
  }
};

module.exports = { register, login };
