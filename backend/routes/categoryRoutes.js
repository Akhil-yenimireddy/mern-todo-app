const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const protect = require('../middleware/authMiddleware');

// GET all categories for the logged-in user
router.get('/', protect, async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
});

// POST a new category
router.post('/', protect, async (req, res) => {
  const newCategory = new Category({ name: req.body.name, user: req.userId });
  const saved = await newCategory.save();
  res.json(saved);
});

module.exports = router;