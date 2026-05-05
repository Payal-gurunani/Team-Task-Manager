const express = require('express');
const { body } = require('express-validator');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, getDashboardStats } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', adminOnly, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('projectId').notEmpty().withMessage('Project is required'),
], createTask);
router.put('/:id', updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
