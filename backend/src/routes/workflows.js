// backend/src/routes/workflows.js
const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validation');

const {
  listWorkflows,
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addTaskToWorkflow,
  removeTaskFromWorkflow,
  calculateWorkflow      // ← import the calc handler
} = require('../controllers/workflowController');

const {
  listComments,
  createComment
} = require('../controllers/commentController');

const router = express.Router();

// List & create
router.get(
  '/',
  listWorkflows
);
router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('Workflow name is required'),
    body('description').optional().isString(),
    body('tasks').optional().isArray(),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be ≥ 0'),
    body('taxRate').optional().isFloat({ min: 0, max: 1 }).withMessage('Tax rate must be between 0 and 1'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be boolean')
  ]),
  createWorkflow
);

// Get one
router.get(
  '/:id',
  validate([ param('id').isUUID().withMessage('Invalid workflow ID') ]),
  getWorkflow
);

// Calculate cost & tax
router.get(
  '/:id/calc',
  validate([ param('id').isUUID().withMessage('Invalid workflow ID') ]),
  calculateWorkflow
);

// Update & delete (owner only)
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid workflow ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().isString(),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be ≥ 0'),
    body('taxRate').optional().isFloat({ min: 0, max: 1 }).withMessage('Tax rate must be between 0 and 1'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be boolean')
  ]),
  updateWorkflow
);

router.delete(
  '/:id',
  validate([ param('id').isUUID().withMessage('Invalid workflow ID') ]),
  deleteWorkflow
);

// Task assignment
router.post(
  '/:id/tasks',
  validate([
    param('id').isUUID().withMessage('Invalid workflow ID'),
    body('taskId').isUUID().withMessage('Invalid task ID')
  ]),
  addTaskToWorkflow
);
router.delete(
  '/:id/tasks/:taskId',
  validate([
    param('id').isUUID().withMessage('Invalid workflow ID'),
    param('taskId').isUUID().withMessage('Invalid task ID')
  ]),
  removeTaskFromWorkflow
);

// Comments on workflows
router.get(
  '/:id/comments',
  validate([ param('id').isUUID().withMessage('Invalid workflow ID') ]),
  listComments
);
router.post(
  '/:id/comments',
  validate([
    param('id').isUUID().withMessage('Invalid workflow ID'),
    body('text').notEmpty().withMessage('Comment text is required'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5')
  ]),
  createComment
);

module.exports = router;
