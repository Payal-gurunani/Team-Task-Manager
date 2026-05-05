const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { title, description, color } = req.body;
    const project = await Project.create({
      title, description, color,
      createdBy: req.user._id,
      teamMembers: [req.user._id],
    });
    await project.populate('createdBy', 'name email role');
    await project.populate('teamMembers', 'name email role');

    // Notify admin
    await User.findByIdAndUpdate(req.user._id, {
      $push: { notifications: { message: `Project "${title}" created successfully`, type: 'project_added' } }
    });

    res.status(201).json({ project });
  } catch (error) { next(error); }
};

const getProjects = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { teamMembers: req.user._id };

    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .populate('teamMembers', 'name email role')
      .sort({ createdAt: -1 });

    // Attach task counts
    const projectsWithCounts = await Promise.all(projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ projectId: p._id });
      const completedCount = await Task.countDocuments({ projectId: p._id, status: 'completed' });
      return { ...p.toJSON(), taskCount, completedCount };
    }));

    res.json({ projects: projectsWithCounts });
  } catch (error) { next(error); }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('teamMembers', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (error) { next(error); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('createdBy', 'name email role')
      .populate('teamMembers', 'name email role');
    res.json({ project: updated });
  } catch (error) { next(error); }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Task.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) { next(error); }
};

const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.teamMembers.push(userId);
    await project.save();
    await project.populate('teamMembers', 'name email role');
    await project.populate('createdBy', 'name email role');

    // Notify new member
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: { message: `You were added to project "${project.title}"`, type: 'project_added' } }
    });

    res.json({ project });
  } catch (error) { next(error); }
};

const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.teamMembers = project.teamMembers.filter(m => m.toString() !== userId);
    await project.save();
    await project.populate('teamMembers', 'name email role');
    await project.populate('createdBy', 'name email role');
    res.json({ project });
  } catch (error) { next(error); }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };
