const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

// GET all tasks for the logged-in user (with category populated)
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.userId })
    .populate('category', 'name')
    .sort({ createdAt: -1 });
  res.json(tasks);
});

// GET dashboard stats
router.get('/stats', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  const now = new Date();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const overdue = tasks.filter(
    (t) => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < now
  ).length;

  res.json({ total, completed, pending, overdue });
});

// GET a single task (for Edit page)
router.get('/:id', protect, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId }).populate('category', 'name');
  res.json(task);
});

// POST a new task
router.post('/', protect, async (req, res) => {
  const { title, description, priority, category, dueDate } = req.body;
  const newTask = new Task({
    title,
    description,
    priority,
    category: category || null,
    dueDate: dueDate || null,
    user: req.userId,
  });
  const savedTask = await newTask.save();
  res.json(savedTask);
});

// PUT (update) a task
router.put('/:id', protect, async (req, res) => {
  const updates = { ...req.body };

  if (updates.status === 'completed') {
    updates.completedAt = new Date();
  } else if (updates.status === 'pending') {
    updates.completedAt = null;
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    updates,
    { new: true }
  );
  res.json(updatedTask);
});

// DELETE a task
router.delete('/:id', protect, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Task deleted' });
});

module.exports = router;