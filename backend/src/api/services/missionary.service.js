const User = require("../models/user.model");
const Missionary = require("../models/missionary.model");
const Organization = require("../models/organization.model");
const Notification = require("../models/notification.model");
const { sendEmail } = require("./email.service");
const {
  missionaryWelcomeWithCredentialsTemplate,
} = require("../utils/emailTemplates");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

/**
 * Creates a new User, a new Missionary profile, and sends credentials.
 * @param {object} missionaryData - Data from the registration form.
 * @param {object} npoAdmin - The authenticated NPO admin creating the missionary.
 */
const registerNewMissionary = async (missionaryData, creator) => {
  const { email, firstName, lastName } = missionaryData;
  console.log("creatorid", creator);
  // 1. Check if a user with this email already exists
  if (await User.findOne({ email })) {
    throw new ApiError(409, `A user with the email ${email} already exists.`);
  }

  // 2. Fetch the NPO's name to use in the welcome email.
  const organization = await Organization.findById(creator.organizationId);
  if (!organization) {
    throw new ApiError(404, "The NPO admin's organization could not be found.");
  }
  const npoName = organization.name;

  // 3. Create the new User with 'missionary' role
  const tempPassword = crypto.randomBytes(8).toString("hex");
  const newUser = new User({
    ...missionaryData,
    role: "missionary",
    password: tempPassword,
    //organizationId: npoAdmin.organizationId,
    organizationId: creator.organizationId,
  });
  await newUser.save();

  // 4. Handle ministryFocus string from the form
  let ministryFocusArray = [];
  if (
    missionaryData.ministryFocus &&
    typeof missionaryData.ministryFocus === "string"
  ) {
    ministryFocusArray = missionaryData.ministryFocus
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  // 5. Create the Missionary Profile linked to the new user
  const missionaryProfile = new Missionary({
    ...missionaryData,
    userId: newUser._id,
    organizationId: creator.organizationId, //npoAdmin.organizationId,
    ministryFocus: ministryFocusArray,
  });
  await missionaryProfile.save();

  try {
    const superAdmins = await User.find({
      role: "super_admin",
      isActive: true,
    });

    await Promise.all(
      superAdmins.map((admin) =>
        Notification.create({
          recipientId: admin._id,
          organizationId: creator.organizationId,
          message: `Missionary '${firstName} ${lastName}' registered under organization '${npoName}'.`,
        })
      )
    );
  } catch (err) {
    console.error("Failed to notify super admins:", err);
  }
  // 6. Send credentials email to the new missionary
  sendEmail(
    newUser.email,
    `Welcome to ${npoName}!`,
    missionaryWelcomeWithCredentialsTemplate({
      missionaryName: firstName,
      npoName: npoName, // Use the fetched name
      loginEmail: newUser.email,
      tempPassword: tempPassword,
    })
  ).catch((err) =>
    console.error("Failed to send missionary welcome email:", err)
  );

  // 7. Create an in-app notification for the NPO Admin who created them
  await Notification.create({
    organizationId: creator.organizationId,
    message: `New missionary "${firstName} ${lastName}" has been successfully registered.`,
  });

  return missionaryProfile;
};

/**
 * Updates the active status of a missionary (block/unblock).
 */
const updateMissionaryStatus = async (missionaryId, isActive, npoAdmin) => {
  const missionary = await Missionary.findOne({
    _id: missionaryId,
    organizationId: npoAdmin.organizationId,
  });
  if (!missionary) {
    throw new ApiError(404, "Missionary not found in your organization.");
  }
  missionary.isActive = isActive;
  await missionary.save();

  // Optional: Notify the missionary user about the status change
  const user = await User.findById(missionary.userId);
  if (user) {
    const message = isActive
      ? `Your missionary profile has been reactivated.`
      : `Your missionary profile has been temporarily blocked by your administrator.`;
    await Notification.create({
      organizationId: npoAdmin.organizationId,
      recipientUserId: user._id,
      message,
    });
  }

  return missionary;
};
/**
 * Finds a missionary profile by the user object from the JWT.
 * @param {object} user - The complete user object from req.user.
 */
const getMissionaryByUserId = async (user) => {
  const userId = user.userId || user.id || user._id;
  if (!userId) {
    throw new ApiError(
      400,
      "User ID could not be determined from the authentication token."
    );
  }
  const missionary = await Missionary.findOne({ userId: userId })
    .populate("organizationId", "name")
    .populate(
      "userId",
      "firstName lastName email phone country continent missionaryCommission"
    );

  if (!missionary) {
    throw new ApiError(404, "Missionary profile not found.");
  }

  // Convert to a plain object to attach the user object directly for a consistent response
  const missionaryObject = missionary.toObject();
  missionaryObject.user = missionaryObject.userId;

  // Manually set ministryName from the populated data
  if (missionaryObject.organizationId) {
    missionaryObject.ministryName = missionaryObject.organizationId.name;
  }

  return missionaryObject;
};

/**
 * Updates both the User and Missionary profiles from a single payload.
 */
const updateMissionaryProfile = async (userFromToken, updateData) => {
  const userId = userFromToken.id;
  if (!userId) {
    throw new ApiError(400, "User ID could not be determined from token.");
  }

  // ✅ THE FIX: Separate the payload into data for the User and data for the Missionary

  // 1. Define which keys belong to the User model
  const userKeys = ["profileName", "phone", "country", "continent"];
  const userUpdatePayload = {};
  const missionaryUpdatePayload = {};

  // 2. Loop through the incoming data and sort it into the correct payload object
  for (const key in updateData) {
    if (userKeys.includes(key)) {
      userUpdatePayload[key] = updateData[key];
    } else {
      missionaryUpdatePayload[key] = updateData[key];
    }
  }

  // 3. Handle the special case for splitting profileName
  if (userUpdatePayload.profileName) {
    const nameParts = userUpdatePayload.profileName.trim().split(" ");
    userUpdatePayload.firstName = nameParts.shift() || "";
    userUpdatePayload.lastName = nameParts.join(" ") || "";
    delete userUpdatePayload.profileName; // remove the temporary key
  }

  // 4. Run database updates
  const [updatedMissionary, updatedUser] = await Promise.all([
    Missionary.findOneAndUpdate(
      { userId: userId },
      { $set: missionaryUpdatePayload },
      { new: true }
    ),
    // Only update the user if there's something to update
    Object.keys(userUpdatePayload).length > 0
      ? User.findByIdAndUpdate(
          userId,
          { $set: userUpdatePayload },
          { new: true }
        )
      : User.findById(userId), // otherwise, just fetch the existing user
  ]);

  // ... rest of the function for formatting the response remains the same ...
  if (!updatedUser || !updatedMissionary) {
    throw new ApiError(404, "Profile could not be found to update.");
  }
  const result = updatedMissionary.toObject();
  result.user = updatedUser.toObject();
  delete result.user.password;
  return result;
};

/**
 * Updates the profile photo URL on the User document.
 * @param {object} userFromToken - The user object from req.user.
 * @param {string} newPhotoPath - The path to the new photo.
 * @returns {Promise<object>} The fully populated missionary profile with the updated user info.
 */
const updateProfilePhoto = async (userFromToken, newPhotoPath) => {
  const updatedUser = await User.findByIdAndUpdate(
    userFromToken.id,
    { profilePhotoUrl: newPhotoPath },
    { new: true, runValidators: true } // Return the updated document
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found to update.");
  }

  // To send a complete response back, find the associated missionary profile
  const missionaryProfile = await Missionary.findOne({
    userId: updatedUser._id,
  }).lean();

  // Return the missionary profile but embed the newly updated user object
  return { ...missionaryProfile, user: updatedUser };
};

/**
 * Adds new image URLs to a missionary's profile.
 * @param {object} userFromToken - The user object from req.user.
 * @param {Array<object>} files - The array of uploaded file objects from Multer.
 * @returns {Promise<object>} The updated missionary document.
 */
const addPageImages = async (userFromToken, files) => {
  // 1. Map the array of file objects to an array of URL strings
  //    The path matches the destination in your uploader options.
  const imageUrls = files.map(
    (file) => `/uploads/page_images/${file.filename}`
  );

  // 2. Find the missionary and push the new URLs into the 'images' array.
  //    Using $push with $each adds all elements from the imageUrls array
  //    without overwriting the existing images.
  const missionaryProfile = await Missionary.findOneAndUpdate(
    { userId: userFromToken.id },
    { $push: { images: { $each: imageUrls } } },
    { new: true, runValidators: true }
  );

  if (!missionaryProfile) {
    throw new ApiError(404, "Missionary profile not found.");
  }

  return missionaryProfile;
};

/**
 * Deletes a page image URL from the database and the corresponding file from storage.
 * @param {object} userFromToken - The user object from req.user.
 * @param {string} imageUrl - The relative URL of the image to delete (e.g., '/uploads/page_images/..').
 */
const deletePageImage = async (userFromToken, imageUrl) => {
  // 1. PULL FROM DATABASE: Remove the specific imageUrl from the 'images' array.
  const missionaryProfile = await Missionary.findOneAndUpdate(
    { userId: userFromToken.id },
    { $pull: { images: imageUrl } },
    { new: true }
  );

  if (!missionaryProfile) {
    throw new ApiError(404, "Missionary profile not found.");
  }

  // 2. DELETE FROM SERVER: Remove the physical file.
  try {
    const fullPath = path.join(__dirname, "..", "..", "..", "public", imageUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    // Log the error but don't stop the process, as the DB entry is already removed.
    console.error(`Failed to delete image file from server: ${err.message}`);
  }

  return missionaryProfile;
};

/**
 * Creates a new User and Missionary profile from a public sign-up form.
 * @param {object} signupData - Data from the public registration form.
 */
const registerPublicMissionary = async (signupData) => {
  const { email, firstName, lastName, password } = signupData;

  // 1. Hardcode the specific Organization ID
  // const organizationId = "685cf5ed94bfe8bda0b8d429"; // NightBirght missionary for (stym@yopmail.com)
  const organizationId = "687e629c6032e8851d08f897";

  //const baseId = '685e6c6367b81feff822e568';
  // 2. Check if a user with this email already exists
  if (await User.findOne({ email })) {
    throw new ApiError(409, `A user with the email ${email} already exists.`);
  }

  // 3. Fetch the organization's name for the welcome email
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    // This is a server configuration error if it happens
    throw new ApiError(500, "The designated organization could not be found.");
  }
  const npoName = organization.name;

  // 4. Create the new User with 'missionary' role
  const newUser = new User({
    firstName,
    lastName,
    email,
    role: "missionary",
    password, // The password from the form is used directly
    organizationId: organizationId,
  });
  await newUser.save();

  // 5. Create the Missionary Profile linked to the new user
  const missionaryProfile = new Missionary({
    userId: newUser._id,
    organizationId: organizationId,
    // You can add default values for other fields if needed
    bio: `Welcome! Please update your profile bio.`,
    //baseId: baseId
  });
  await missionaryProfile.save();
  try {
    const superAdmins = await User.find({
      role: "super_admin",
    });

    await Promise.all(
      superAdmins.map((admin) =>
        Notification.create({
          recipientId: admin._id,
          organizationId: organizationId,
          recipientRole: "super_admin",
          message: `Missionary '${firstName} ${lastName}' registered under organization '${npoName}'.`,
          type: "missionary_registration",
          isRead: false,
        })
      )
    );
  } catch (err) {
    console.error("Failed to notify super admins:", err);
  }
  // 6. Send a welcome email (without temporary credentials)
  // You might want a different email template for public sign-ups
  sendEmail(
    newUser.email,
    `Welcome to ${npoName}!`,
    // NOTE: You should create a new, simpler email template for this flow
    `<h1>Welcome, ${firstName}!</h1><p>Thank you for signing up with ${npoName}. You can now log in with the credentials you provided.</p>`
  ).catch((err) =>
    console.error("Failed to send public missionary welcome email:", err)
  );

  // 7. Return the new user and profile
  return { user: newUser, profile: missionaryProfile };
};

// const getAllMissionaries = async ({
//     page = 1,
//     perPage = 10,
//     search = '',
//     filter = {},
//     sortField = "",
//     sortOrder = "asc",
// } = {}) => {
//     try {
//         let query = {};
//         if (filter && typeof filter === 'object') {
//             Object.entries(filter).forEach(([key, value]) => {
//                 if (value !== undefined && value !== '') {
//                     query[key] = value;
//                 }
//             });
//         }
//         if (search) {
//             const searchRegex = new RegExp(search, 'i');
//             const matchingUsers = await User.find({
//                 $or: [
//                     { firstName: searchRegex },
//                     { lastName: searchRegex },
//                     { email: searchRegex }
//                 ]
//             }).select('_id');
//             const userIds = matchingUsers.map(user => user._id);
//             const matchingBases = await Base.find({
//                 location: searchRegex
//             }).select('_id');
//             const baseIds = matchingBases.map(base => base._id);
//             const searchConditions = [];
//             if (userIds.length > 0) {
//                 searchConditions.push({ 'userId': { $in: userIds } });
//             }
//             if (baseIds.length > 0) {
//                 searchConditions.push({ 'baseId': { $in: baseIds } });
//             }
//             if (searchConditions.length > 0) {
//                 if (query.$or) {
//                     query.$and = query.$and || [];
//                     query.$and.push({ $or: searchConditions });
//                 } else {
//                     query.$or = searchConditions;
//                 }
//             } else if (search && searchConditions.length === 0) {
//                  query._id = null;
//             }
//         }

//         const sort = {};
//         if (sortField) {
//             sort[sortField] = sortOrder === 'asc' ? 1 : -1;
//         } else {
//             sort.createdAt = -1;
//         }

//         const skip = (page - 1) * perPage;

//         const missionaries = await Missionary.find(query)
//             .populate('userId', 'firstName lastName email')
//             .populate('baseId', 'location')
//             .sort(sort)
//             .skip(skip)
//             .limit(perPage);

//         const total = await Missionary.countDocuments(query);

//         return {
//             data: missionaries,
//             total,
//             page,
//             perPage,
//             totalPages: Math.ceil(total / perPage)
//         };
//     } catch (error) {
//         console.error("Error fetching missionaries:", error);
//         throw error;
//     }
// };
const getAllMissionaries = async ({
  page = 1,
  perPage = 10,
  search = "",
  filter = {},
  sortField = "",
  sortOrder = "asc",
} = {}) => {
  try {
    let query = {};

    // Apply initial filters (e.g., organizationId from req.user, or baseId if base_user)
    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          query[key] = value;
        }
      });
    }

    // Handle search across User fields (first name, last name, email) and User location
    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Find matching User IDs that are either the missionary's userId or a base user's userId
      const matchingUsers = await User.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          // Search by location for users who are potentially 'base_user'
          { location: searchRegex, role: "base_user" },
        ],
      }).select("_id");
      const userIds = matchingUsers.map((user) => user._id);

      const searchConditions = [];
      if (userIds.length > 0) {
        // This covers searching by missionary's own userId details AND
        // by the base user's userId (which is the location) if baseId refers to a User
        searchConditions.push({ userId: { $in: userIds } });
        searchConditions.push({ baseId: { $in: userIds } });
      }

      if (searchConditions.length > 0) {
        if (query.$or) {
          // If query already has an $or from previous filters, combine them
          query.$and = query.$and || [];
          query.$and.push({ $or: searchConditions });
        } else {
          query.$or = searchConditions;
        }
      } else if (search && searchConditions.length === 0) {
        // If search term was provided but yielded no matches in users,
        // ensure no results are returned by current query for the search part.
        query._id = null; // Force no results if search finds nothing
      }
    }

    // Handle sorting logic
    const sort = {};
    if (sortField) {
      // Important: Direct .sort() on populated fields like 'userId.firstName' or 'baseId.location'
      // does NOT work directly as string. Mongoose sorts by the _id of the populated document.
      // For proper sorting on nested populated fields, a Mongoose Aggregation Pipeline is required.
      // If sortField is 'userId' or 'baseId', it will sort by the respective ObjectId.
      // If it's 'createdAt', it sorts directly.
      sort[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort order
    }

    const skip = (page - 1) * perPage;

    const missionaries = await Missionary.find(query)
      .populate("userId", "firstName lastName email")
      .populate("baseId", "location") // Still populate baseId as a User to get its location
      .sort(sort)
      .skip(skip)
      .limit(perPage);

    const total = await Missionary.countDocuments(query);

    return {
      data: missionaries,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("Error fetching missionaries:", error);
    throw error;
  }
};

const assignBase = async (missionaryId, baseId, npoAdmin) => {
  if (!baseId) {
    throw new ApiError(400, "Base ID is required.");
  }

  // Find the missionary within the admin's organization
  const missionary = await Missionary.findOne({
    _id: missionaryId,
    organizationId: npoAdmin.organizationId,
  });

  if (!missionary) {
    throw new ApiError(404, "Missionary not found in your organization.");
  }

  // Optional but recommended: Verify the base also belongs to the same organization
  const base = await User.findOne({
    _id: baseId,
    organizationId: npoAdmin.organizationId,
    role: "base_user",
  });

  if (!base) {
    throw new ApiError(404, "Base not found in your organization.");
  }

  missionary.baseId = baseId;
  await missionary.save();
  return missionary;
};

/**
 * Uploads a verification document, saves its path, and deletes the old one.
 * @param {object} userFromToken - The user object from req.user.
 * @param {object} file - The uploaded file object from Multer.
 */
const updateVerificationDocument = async (userFromToken, file) => {
  const newDocumentPath = `/uploads/documents/${file.filename}`;

  const missionary = await Missionary.findOne({ userId: userFromToken.id });
  if (!missionary) {
    throw new ApiError(404, "Missionary profile not found.");
  }

  // Delete the old document if it exists
  const oldDocumentPath = missionary.verificationDocumentUrl;
  if (oldDocumentPath) {
    const fullPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      oldDocumentPath
    );
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  // Save the new document path
  missionary.verificationDocumentUrl = newDocumentPath;
  await missionary.save();

  return missionary;
};

/**
 * Deletes a verification document URL from the DB and the file from storage.
 * @param {object} userFromToken - The user object from req.user.
 */
const deleteVerificationDocument = async (userFromToken) => {
  const missionary = await Missionary.findOne({ userId: userFromToken.id });
  if (!missionary) {
    throw new ApiError(404, "Missionary profile not found.");
  }

  const documentUrl = missionary.verificationDocumentUrl;
  if (documentUrl) {
    // Delete the file from the server
    const fullPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      documentUrl
    );
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    // Remove the path from the database
    missionary.verificationDocumentUrl = "";
    await missionary.save();
  }

  return missionary;
};

module.exports = {
  registerNewMissionary,
  updateMissionaryStatus,
  getMissionaryByUserId,
  updateMissionaryProfile,
  updateProfilePhoto,
  registerPublicMissionary,
  getAllMissionaries,
  assignBase,
  addPageImages,
  deletePageImage,
  updateVerificationDocument,
  deleteVerificationDocument,
};
