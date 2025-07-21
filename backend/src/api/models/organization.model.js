const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    domainSlug: { type: String, required: true, unique: true },
    logoUrl: String,
    backgroundColor: String,
    brandName: {
      type: String,
    },
    themeColor: {
      type: String,
      default: "#00A76F",
    },
    email: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true, unique: true },
    stripeConnectId: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      // Add 'pending_approval' to the list of possible statuses
      enum: [
        "active",
        "inactive",
        "pending_payment",
        "pending_approval",
        "rejected",
      ],
      // Set the default status for all new organizations
      default: "pending_approval",
    },
    isBlocked: { type: Boolean, default: false },
    plan: {
      type: String,
      enum: ["starter", "standard", "premium", "basic", "bussiness", "free"],
      required: true,
    },
    stripeSubscriptionId: { type: String },
    subscriptionStatus: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
      ],
      default: "active",
    },
    subscriptionEndDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
