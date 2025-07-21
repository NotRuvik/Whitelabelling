const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["starter", "standard", "premium", "business", "custom"], 
      required: true,
      unique: true,
    },
    stripePriceId: {
      type: String,
      required: true,
      unique: true,
    },
    priceInCents: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);