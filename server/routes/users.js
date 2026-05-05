const express = require('express');
const { getAllUsers, getNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/', adminOnly, getAllUsers);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);

module.exports = router;
