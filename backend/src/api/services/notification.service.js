const Notification = require("../models/notification.model");
const ApiError = require("../utils/apiError");

/**
 * Gets notifications for the logged-in user based on their role.
 */
const getNotificationsForUser = async (user) => {
  if (user.role === "super_admin") {
    return await Notification.find({
      organizationId: user.organizationId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  if (user.role === "npo_admin") {
    return await Notification.find({
      organizationId: user.organizationId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }
  return [];
};

/**
 * Marks a list of specific notifications as read for the current user.
 */
const markNotificationsAsRead = async (notificationIds, user) => {
  const query = { _id: { $in: notificationIds }, isDeleted: false };
  // Ensure users can only affect their own notifications
  if (user.role === "super_admin") query.organizationId = user.organizationId;
  else if (user.role === "npo_admin")
    query.organizationId = user.organizationId;

  return await Notification.updateMany(query, { $set: { isRead: true } });
};

/**
 * Marks ALL notifications as read for the current user.
 */
const markAllNotificationsAsRead = async (user) => {
  const query = {};
  if (user.role === "super_admin") query.organizationId = user.organizationId;
  else if (user.role === "npo_admin")
    query.organizationId = user.organizationId;
  else return; // Should not happen if called from a protected route
  query.isDeleted = false;
  return await Notification.updateMany(query, { $set: { isRead: true } });
};

/**
 * Deletes a single notification for the current user.
 */
const deleteNotification = async (notificationId, user) => {
  const query = { _id: notificationId };
  if (user.role === "super_admin") query.organizationId = user.organizationId;
  else if (user.role === "npo_admin")
    query.organizationId = user.organizationId;

  const result = await Notification.updateOne(query, { $set: { isDeleted: true } });
  if (result.modifiedCount === 0) {
    throw new ApiError(
      404,
      "Notification not found or user does not have permission to delete it."
    );
  }
  return result;
};

/**
 * Deletes ALL notifications for the current user.
 */
const deleteAllNotifications = async (user) => {
  const query = {};
  if (user.role === "super_admin") query.organizationId = user.organizationId;
  else if (user.role === "npo_admin")
    query.organizationId = user.organizationId;
  else return;

  return await Notification.updateMany(query, { $set: { isDeleted: true } });
};

module.exports = {
  getNotificationsForUser,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
