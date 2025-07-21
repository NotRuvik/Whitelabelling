const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const path = require("path");
const crypto = require("crypto");
const { sendEmail } = require("./email.service");
const organizationService = require('../services/organization.service');
const {
  donorWelcomeWithCredentialsTemplate,
} = require("../utils/emailTemplates");

const updateUserAvatar = async (userId, filePath) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  // Construct the URL path to the image
  const photoUrl = `/uploads/avatars/${path.basename(filePath)}`;
  user.profilePhotoUrl = photoUrl;
  await user.save();
  return user;
};

/**
 * Finds a user by email. If not found and not anonymous, creates a new user with role 'donor'.
 * @param {string} email - The donor's email.
 * @param {string} name - The donor's name.
 * @param {string} organizationId - The ID of the organization receiving the donation.
 * @returns {object|null} The user object or null if anonymous.
 */
const findOrCreateDonor = async (email, name, organizationId) => {
  if (!email) {
    // This is an anonymous donation, so we don't create a user.
    return null;
  }

  let user = await User.findOne({ email });

  if (user) {
    return user;
  }

  const [firstName, ...lastNameParts] = name.split(" ");
  const tempPassword = crypto.randomBytes(8).toString("hex");

  user = new User({
    firstName,
    lastName: lastNameParts.join(" ") || firstName, // Handle single-name entries
    email,
    password: tempPassword, 
    role: "donor",
    organizationId, 
  });
  await user.save();
  sendEmail(
    email,
    "Thank you for your donation! Your account is ready.",
    donorWelcomeWithCredentialsTemplate({
      donorName: firstName,
      loginEmail: email,
      tempPassword,
    })
  ).catch((err) => console.error("Failed to send donor welcome email:", err));
  return user;
};

const updateUser = async (id, UpdObj, user) => {
  try {
    const userUpdateObj = {
      firstName: UpdObj.firstName,
      lastName: UpdObj.lastName,
      phone: UpdObj.phoneNumber || UpdObj.phone, 
      continent: UpdObj.continent,
      location: UpdObj.country,
      commission: UpdObj.commission,
      npoCommission: UpdObj.npoCommission,
      missionaryCommission: UpdObj.missionaryCommission
    };

    const organizationUpdateObj = {
      themeColor: UpdObj.whiteLabelThemeColor,
      brandName: UpdObj.brandName,
    };

    const updatedUser = await User.findByIdAndUpdate(id, userUpdateObj, { new: true });

    if (updatedUser.organizationId) {
      const updatedOrganization = await organizationService.updateOrganization(
        updatedUser.organizationId,
        organizationUpdateObj
      );
      return { updatedUser, updatedOrganization };
    } else {
      return { updatedUser }; 
    }
  } catch (error) {
    throw new ApiError(500, error.message); 
  }
};

module.exports = { updateUserAvatar, findOrCreateDonor, updateUser };
