const express = require('express');
const { body } = require('express-validator');
const { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', adminOnly, [
  body('title').trim().notEmpty().withMessage('Title is required'),
], createProject);
router.put('/:id', adminOnly, updateProject);
router.delete('/:id', adminOnly, deleteProject);
router.put('/:id/add-member', adminOnly, addMember);
router.put('/:id/remove-member', adminOnly, removeMember);

module.exports = router;
