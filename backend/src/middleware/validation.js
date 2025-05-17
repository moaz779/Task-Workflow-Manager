// backend/src/middleware/validation.js
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation chains
    await Promise.all(validations.map(v => v.run(req)));

    // Gather the results
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Flatten into a single message string
    const message = errors
      .array()
      .map(err => `${err.param}: ${err.msg}`)
      .join(', ');

    // Return a flat { message } JSON
    return res.status(400).json({ message });
  };
};

module.exports = validate;
