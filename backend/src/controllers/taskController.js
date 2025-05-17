// backend/src/controllers/taskController.js
require('dotenv').config();
const { Op } = require('sequelize');
const { Task, User } = require('../models');
const transporter = require('../utils/mailer');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
const normalizeStatus = status => {
  if (!status) return undefined;
  switch (status) {
    case 'todo':        return 'To-Do';
    case 'in-progress': return 'In-Progress';
    case 'done':        return 'Done';
    default:            return status;
  }
};

const listTasks = async (req, res) => {
  try {
    const { status, priority, dueBefore } = req.query;
    const where = { userId: req.user.id };
    if (status)   where.status   = normalizeStatus(status);
    if (priority) where.priority = capitalize(priority);
    if (dueBefore) where.dueDate = { [Op.lte]: dueBefore };

    const tasks = await Task.findAll({ where });
    return res.json(tasks);
  } catch (err) {
    console.error('List tasks error:', err);
    return res.status(500).json({ message: 'Could not list tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, estimate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId:      req.user.id,
      title,
      description: description || null,
      dueDate:     dueDate ? new Date(dueDate) : null,
      priority:    priority ? capitalize(priority) : Task.rawAttributes.priority.defaultValue,
      status:      status   ? normalizeStatus(status) : Task.rawAttributes.status.defaultValue,
      estimate:    parseFloat(estimate) || Task.rawAttributes.estimate.defaultValue,
    });

    // notification email
    try {
      const user = await User.findByPk(req.user.id);
      await transporter.sendMail({
        from:    process.env.EMAIL_FROM,
        to:      user.email,
        subject: 'New Task Created',
        text:    `Hi ${user.name},\n\nYour task "${task.title}" was created and is due ${dueDate || 'no due date'}.\n\n– Task Manager`,
      });
      console.log(`Email sent to ${user.email}`);
    } catch (mailErr) {
      console.error('Email error:', mailErr);
    }

    return res.status(201).json(task);
  } catch (err) {
    console.error('Task creation error:', err);
    return res.status(500).json({ message: 'Task creation failed' });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    console.error('Get task error:', err);
    return res.status(500).json({ message: 'Could not retrieve task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, estimate } = req.body;

    const updateData = {};
    if (title       !== undefined) updateData.title       = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate     !== undefined) updateData.dueDate     = new Date(dueDate);
    if (priority    !== undefined) updateData.priority    = capitalize(priority);
    if (status      !== undefined) updateData.status      = normalizeStatus(status);
    if (estimate    !== undefined) updateData.estimate    = parseFloat(estimate);

    const [updated] = await Task.update(updateData, {
      where: { id, userId: req.user.id },
      returning: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByPk(id);
    return res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({ message: 'Could not update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ message: 'Could not delete task' });
  }
};

module.exports = {
  listTasks,
  createTask,
  getTask,         // ← ensure this is exported
  updateTask,
  deleteTask,
};
