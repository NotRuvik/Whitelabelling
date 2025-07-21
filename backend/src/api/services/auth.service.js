const User = require("../models/user.model");
const Organization = require("../models/organization.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { sendEmail } = require("./email.service");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const loginUser = async (email, password, expectedRole) => {
  const user = await User.findOne({ email }).select("+password ").populate('organizationId');
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Incorrect email or password");
  }
  // If an expectedRole was passed AND the user's role does not match, deny access.
  if (expectedRole && user.role !== expectedRole) {
    throw new ApiError(
      403,
      `Access Denied. This login is for ${expectedRole} users only.`
    );
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, organizationId: user.organizationId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
  user.password = undefined; 

  return { user, token };
};

const loginWithGoogle = async (idToken, expectedRole) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  let user = await User.findOne({ email });
  if (user) {
    // --- SCENARIO 1: USER ALREADY EXISTS ---
    // If an expected role was provided and it does not match the user's role, deny access.
    if (expectedRole && user.role !== expectedRole) {
      throw new ApiError(
        403,
        `Access Denied. This login is for ${expectedRole} users only.`
      );
    }
  } else {
    // --- SCENARIO 2: NEW USER SIGNING UP VIA GOOGLE ---
    // If creating a new user through this flow, assign them the expected role.
    // For your missionary portal, this should be 'missionary'.
    const [firstName, ...lastNameParts] = name.split(" ");
    user = await User.create({
      firstName,
      lastName: lastNameParts.join(" "),
      email,
      profileImage: picture,
      // Assign the role. If no role is specified from the front-end for some reason,
      // it's safer to default to 'missionary' in this context.
      role: expectedRole,
      provider: "google", // Mark how this user was created
      password: crypto.randomBytes(16).toString("hex"), // Create a random password since one isn't provided
    });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, organizationId: user.organizationId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
  //const token = generateToken(user._id); // Your existing JWT generator
  return { user, token };
};

const forgotPassword = async (email, host) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Silently succeed to prevent attackers from checking which emails are registered.
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // The reset URL your user will click in the email
  // Make sure your frontend URL is in an environment variable for production
  const resetURL = `${
    process.env.FRONTEND_URL || host
  }/reset-password/${resetToken}`;

  // A simple HTML body for the email
  const message = `
        <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <p><a href="${resetURL}"><strong>${resetURL}</strong></a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link is valid for 10 minutes.</p>
    `;

  try {
    // Pass the arguments separately to match your sendEmail function definition
    await sendEmail(
      user.email,
      "Your Password Reset Token (Valid for 10 min)",
      message
    );
  } catch (err) {
    // If email fails, reset the token fields in the DB so the user can try again
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Throw the error that the controller will catch
    throw new ApiError(
      500,
      "There was an error sending the email. Try again later."
    );
  }
};

const resetPassword = async (token, newPassword) => {
  // 1. Hash the incoming token to match the one in the DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find the user by the hashed token and check if it hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired.");
  }

  // 3. Set the new password and clear the reset fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // The pre-save hook will hash the new password
  await user.save();

  // You might want to log the user in here by creating and returning a new JWT token
};
module.exports = { loginUser, forgotPassword, resetPassword, loginWithGoogle };
