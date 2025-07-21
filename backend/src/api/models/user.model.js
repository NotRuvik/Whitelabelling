const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      // required: [true, 'Password is required'],
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["super_admin", "npo_admin", "missionary", "base_user", "donor"],
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    continent: { type: String },
    commission: {
      type: [Number],
      default: [],
    },
    npoCommission: { type: String },
    missionaryCommission: { type: String },
    profilePhotoUrl: {
      type: String,
      default: "",
    },
    isBlocked: { type: Boolean, default: false },
    isReported: { type: Boolean, default: false },
    location: {
      type: String,
      default: null,
    },
    acceptedTerms: { type: Boolean, default: true },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token to expire in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token to be sent via email
};

module.exports = mongoose.model("User", userSchema);
