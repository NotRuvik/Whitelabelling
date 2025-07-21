const notificationService = require('../services/notification.service');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const getMyOrgNotifications = async (req, res, next) => {
    try {
        // The 'protect' middleware should add the user object to the request
        if (!req.user || !req.user.organizationId) {
            throw new ApiError(400, 'User organization information is missing.');
        }
        const notifications = await notificationService.getNotificationsForOrg(req.user.organizationId);
        res.status(200).json(new ApiResponse(200, notifications));
    } catch (error) {
        next(error);
    }
};
const markAsRead = async (req, res, next) => {
    try {
        const { notificationIds } = req.body;
        await notificationService.markNotificationsAsRead(notificationIds, req.user);
        res.status(200).json(new ApiResponse(200, null, 'Notifications marked as read.'));
    } catch (error) {
        next(error);
    }
};
const getMyNotifications = async (req, res, next) => {
    try {
        // The service now handles the role-based logic
        const notifications = await notificationService.getNotificationsForUser(req.user);
        res.status(200).json(new ApiResponse(200, notifications));
    } catch (error) {
        next(error);
    }
};
const markAllAsRead = async (req, res, next) => {
    try {
        await notificationService.markAllNotificationsAsRead(req.user);
        res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read.'));
    } catch (error) {
        next(error);
    }
};

const clearOne = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        await notificationService.deleteNotification(notificationId, req.user);
        res.status(200).json(new ApiResponse(200, null, 'Notification cleared.'));
    } catch (error) {
        next(error);
    }
};

const clearAll = async (req, res, next) => {
    try {
        await notificationService.deleteAllNotifications(req.user);
        res.status(200).json(new ApiResponse(200, null, 'All notifications cleared.'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyOrgNotifications,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    clearOne,
    clearAll,
};