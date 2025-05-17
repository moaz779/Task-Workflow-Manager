// backend/src/controllers/workflowController.js
const { Workflow, Task } = require('../models');
const { Op } = require('sequelize');

//
// List all workflows visible to you:
//   - Your own
//   - Any workflow marked public
//
const listWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.findAll({
      where: {
        [Op.or]: [
          { userId: req.user.id },
          { isPublic: true }
        ]
      },
      include: [{ model: Task, as: 'tasks' }]
    });
    return res.json(workflows);
  } catch (err) {
    console.error('List workflows error:', err);
    return res.status(500).json({ message: 'Could not list workflows' });
  }
};

//
// Create a new workflow (with privacy, cost, tax, and optional tasks)
//
const createWorkflow = async (req, res) => {
  console.log('🛠️ createWorkflow called with', req.body);
  try {
    const { name, description, tasks, cost, taxRate, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const workflow = await Workflow.create({
      userId:      req.user.id,
      name,
      description: description || null,
      cost:        parseFloat(cost)    || 0.0,
      taxRate:     parseFloat(taxRate) || 0.0,
      isPublic:    Boolean(isPublic),
    });

    // Associate any initial tasks
    if (Array.isArray(tasks) && tasks.length) {
      await workflow.setTasks(tasks);
    }

    // Reload with its tasks
    const result = await Workflow.findByPk(workflow.id, {
      include: [{ model: Task, as: 'tasks' }]
    });

    console.log('✅ Workflow created:', result.toJSON());
    return res.status(201).json(result);
  } catch (err) {
    console.error('❌ createWorkflow error:', err);
    return res.status(500).json({ message: err.message || 'Workflow creation failed' });
  }
};

//
// Fetch one workflow by id — allows public ones too
//
const getWorkflow = async (req, res) => {
  try {
    // allow your own OR any public workflow
    const workflow = await Workflow.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { userId:   req.user.id },
          { isPublic: true }
        ]
      },
      include: [{ model: Task, as: 'tasks' }]
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    // serialize to JSON and tack on an `isOwner` flag
    const data = workflow.toJSON();
    data.isOwner = (workflow.userId === req.user.id);

    return res.json(data);
  } catch (err) {
    console.error('Get workflow error:', err);
    return res.status(500).json({ message: 'Could not retrieve workflow' });
  }
};

//
// Update a workflow (you must own it)
//
const updateWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost, taxRate, isPublic } = req.body;

    const [updated] = await Workflow.update(
      {
        name,
        description,
        cost:     cost    !== undefined ? parseFloat(cost)    : undefined,
        taxRate:  taxRate !== undefined ? parseFloat(taxRate) : undefined,
        isPublic: isPublic !== undefined ? Boolean(isPublic)  : undefined
      },
      { where: { id, userId: req.user.id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Workflow not found or not yours' });
    }

    const updatedWorkflow = await Workflow.findByPk(id, {
      include: [{ model: Task, as: 'tasks' }]
    });
    return res.json(updatedWorkflow);
  } catch (err) {
    console.error('Update workflow error:', err);
    return res.status(500).json({ message: 'Could not update workflow' });
  }
};

//
// Delete a workflow (you must own it)
//
const deleteWorkflow = async (req, res) => {
  try {
    const deleted = await Workflow.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Workflow not found or not yours' });
    }
    return res.status(200).json({ message: 'Workflow deleted successfully' });
  } catch (err) {
    console.error('Delete workflow error:', err);
    return res.status(500).json({ message: 'Could not delete workflow' });
  }
};

//
// Add / remove tasks (you must own the workflow)
//
const addTaskToWorkflow = async (req, res) => {
  try {
    const wf = await Workflow.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!wf) return res.status(404).json({ message: 'Workflow not found or not yours' });
    await wf.addTask(req.body.taskId);
    const updated = await Workflow.findByPk(req.params.id, { include: [{ model: Task, as: 'tasks' }] });
    return res.json(updated);
  } catch (err) {
    console.error('Add task error:', err);
    return res.status(500).json({ message: 'Could not add task to workflow' });
  }
};

const removeTaskFromWorkflow = async (req, res) => {
  try {
    const wf = await Workflow.findOne({ where: { id: req.params.workflowId, userId: req.user.id } });
    if (!wf) return res.status(404).json({ message: 'Workflow not found or not yours' });
    await wf.removeTask(req.params.taskId);
    return res.status(200).json({ message: 'Task removed from workflow' });
  } catch (err) {
    console.error('Remove task error:', err);
    return res.status(500).json({ message: 'Could not remove task from workflow' });
  }
};

//
// Calculate cost & tax (unchanged)
//
const calculateWorkflow = async (req, res) => {
  try {
    const wf = await Workflow.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { userId: req.user.id },
          { isPublic: true }
        ]
      }
    });
    if (!wf) return res.status(404).json({ message: 'Workflow not found' });

    const subtotal  = parseFloat(wf.cost);
    const taxRate   = parseFloat(wf.taxRate);
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    const total     = parseFloat((subtotal + taxAmount).toFixed(2));

    return res.json({ subtotal, taxRate, taxAmount, total });
  } catch (err) {
    console.error('Calculate workflow cost error:', err);
    return res.status(500).json({ message: 'Could not calculate cost' });
  }
};

module.exports = {
  listWorkflows,
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addTaskToWorkflow,
  removeTaskFromWorkflow,
  calculateWorkflow
};
