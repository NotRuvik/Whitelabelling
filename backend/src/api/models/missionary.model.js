const mongoose = require("mongoose");

const missionarySchema = new mongoose.Schema(
  {
    // Foreign key to the User model for auth info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // It references the User model (where the base_user is)
      default: null,
    },
    // Tenant ID for data isolation
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
     stripeConnectId: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    profilePhotoUrl: String,
    images: [String],
    facebookUrl: String,
    startedDate: { type: Date },
    websiteUrl: { type: String, default: '' },
    verificationDocumentUrl: { type: String, default: '' },
    //phoneNumber: { type: String, default: '' },
    instagramUrl: String,
    videoUrl: String,
    bio: String,
    about: String,
    ministryFocus: [String],
    ministryTaxId: String,
    // country: String,
    // continent: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

missionarySchema.index({ userId: 1, organizationId: 1 }, { unique: true });

module.exports = mongoose.model("Missionary", missionarySchema);
