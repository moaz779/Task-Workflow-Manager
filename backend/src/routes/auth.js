// backend/src/routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');  // ← Added validationResult
const { register, login } = require('../controllers/authController');

const router = express.Router();

// ── Register ────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      // Return a flat { message: '...' } so front-end setFieldError(err.response.data.message) works
      return res.status(400).json({ message: errs.array().map(e => e.msg).join(', ') });
    }
    next();
  },
  register
);

// ── Login ───────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ message: errs.array().map(e => e.msg).join(', ') });
    }
    next();
  },
  login
);

module.exports = router;
