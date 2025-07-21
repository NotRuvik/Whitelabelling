const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    plan: {
      type: String,
      enum: ["standard", "premium", "starter"],
      required: true,
    },
    // The Stripe ID for the recurring subscription object
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "incomplete", "trialing", "past_due", "canceled", "unpaid"],
      required: true,
    },
    // The date the subscription will next be billed
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);