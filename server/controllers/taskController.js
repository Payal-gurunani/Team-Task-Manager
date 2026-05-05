const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { title, description, projectId, assignedTo, status, priority, dueDate, tags } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title, description, projectId, assignedTo, createdBy: req.user._id,
      status: status || 'pending', priority: priority || 'medium', dueDate, tags,
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('projectId', 'title');

    if (assignedTo) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: { notifications: { message: `New task "${title}" assigned to you in "${project.title}"`, type: 'task_assigned' } }
      });
    }

    res.status(201).json({ task });
  } catch (error) { next(error); }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority, assignedTo, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    if (req.user.role === 'member') {
      const userProjects = await Project.find({ teamMembers: req.user._id }).select('_id');
      query.projectId = { $in: userProjects.map(p => p._id) };
      if (projectId) query.projectId = projectId;
    }

    if (assignedTo) query.assignedTo = assignedTo;
    else if (req.user.role === 'member') query.assignedTo = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('projectId', 'title color')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query),
    ]);

    res.json({ tasks, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title color');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (error) { next(error); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isMember = req.user.role === 'member';
    if (isMember) {
      const allowedFields = ['status'];
      const updateKeys = Object.keys(req.body);
      const isAllowed = updateKeys.every(k => allowedFields.includes(k));
      if (!isAllowed) return res.status(403).json({ message: 'Members can only update task status' });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title color');

    if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo?.toString()) {
      await User.findByIdAndUpdate(req.body.assignedTo, {
        $push: { notifications: { message: `Task "${task.title}" has been assigned to you`, type: 'task_assigned' } }
      });
    }

    res.json({ task: updated });
  } catch (error) { next(error); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) { next(error); }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const query = req.user.role === 'member' ? { assignedTo: req.user._id } : {};

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: 'pending' }),
      Task.countDocuments({ ...query, status: 'in_progress' }),
      Task.countDocuments({ ...query, status: 'completed' }),
      Task.countDocuments({ ...query, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
    ]);

    const recentTasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title color')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({ stats: { total, pending, inProgress, completed, overdue }, recentTasks });
  } catch (error) { next(error); }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getDashboardStats };
