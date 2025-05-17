const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const { getProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/me', getProfile);

router.put(
  '/me',
  validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ]),
  updateProfile
);

module.exports = router;