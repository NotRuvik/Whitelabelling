const express = require('express');
const { getMyNotifications, markAsRead, markAllAsRead, clearOne, clearAll } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware'); // No need for 'authorize' here

const router = express.Router();
router.use(protect);

// This single route now works for ANY authenticated user
router.get('/', getMyNotifications);

router.patch('/read', markAsRead);
router.patch('/read-all', markAllAsRead);

// DELETE
router.delete('/', clearAll); // Note: No ID, clears all for the user
router.delete('/:notificationId', clearOne); // Clears a specific one

module.exports = router;