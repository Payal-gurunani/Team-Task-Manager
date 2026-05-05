const User = require('../models/User');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) { next(error); }
};

const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
    res.json({ notifications });
  } catch (error) { next(error); }
};

const markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) { next(error); }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getNotifications, markNotificationRead, markAllNotificationsRead };
