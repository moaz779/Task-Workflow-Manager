// backend/src/routes/tasks.js
const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validation');
const {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

router.get(
  '/',
  validate([
    query('status')
      .optional()
      .isIn(['todo','in-progress','done'])
      .withMessage('Invalid status'),
    query('priority')
      .optional()
      .isIn(['low','medium','high'])
      .withMessage('Invalid priority'),
    query('dueBefore')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format for dueBefore')
  ]),
  listTasks
);

router.post(
  '/',
  validate([
    body('title')
      .notEmpty()
      .withMessage('Title is required'),
    body('description')
      .optional()
      .isString(),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format for dueDate'),
    body('priority')
      .optional()
      .isIn(['low','medium','high'])
      .withMessage('Invalid priority'),
    body('status')
      .optional()
      .isIn(['todo','in-progress','done'])
      .withMessage('Invalid status')
  ]),
  createTask
);

router.get(
  '/:id',
  validate([
    param('id')
      .isUUID()
      .withMessage('Invalid task ID')
  ]),
  getTask
);

router.put(
  '/:id',
  validate([
    param('id')
      .isUUID()
      .withMessage('Invalid task ID'),
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('description')
      .optional()
      .isString(),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format for dueDate'),
    body('priority')
      .optional()
      .isIn(['low','medium','high'])
      .withMessage('Invalid priority'),
    body('status')
      .optional()
      .isIn(['todo','in-progress','done'])
      .withMessage('Invalid status')
  ]),
  updateTask
);

router.delete(
  '/:id',
  validate([
    param('id')
      .isUUID()
      .withMessage('Invalid task ID')
  ]),
  deleteTask
);

router.get('/threshold', async (req, res) => {
  try {
    const { dailyEstimate, threshold } = await deleteTask; // reuse checkDailyEstimate?
    // Instead call the util directly:
    const total = await require('../controllers/taskController').checkDailyEstimate(req.user.id);
    return res.json({ dailyEstimate: total, threshold: parseFloat(process.env.THRESHOLD_HOURS || '8') });
  } catch (err) {
    console.error('Threshold error:', err);
    return res.status(500).json({ message: 'Could not check threshold' });
  }
});

module.exports = router;
