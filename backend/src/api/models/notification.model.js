const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    recipientRole: {
      type: String,
      enum: ["super_admin"],
    },
    message: {
      type: String,
      required: true,
    },
    recipientUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose to populate from the 'User' collection
        required: false, // Or true, depending on your logic
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
