const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const ApiError = require('../utils/apiError');
const crypto = require('crypto');
const { sendEmail } = require('./email.service');
const { baseUserWelcomeWithCredentialsTemplate } = require('../utils/emailTemplates');

/**
 * Creates a new User with role 'base_user' and sends credentials.
 * @param {object} baseData - Form data from the frontend.
 * @param {object} npoAdmin - The authenticated NPO admin creating the base user.
 */
const registerNewBaseUser = async (baseData, npoAdmin, tenant) => {
    const { email, firstName, lastName, location } = baseData;

    if (await User.findOne({ email })) {
        throw new ApiError(409, `A user with the email ${email} already exists.`);
    }

    // Use tenant context for organization
    const organizationId = tenant?._id;
    if (!organizationId) {
        throw new ApiError(400, 'No organization context found.');
    }

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const newBaseUser = new User({
        ...baseData,
        role: 'base_user',
        password: tempPassword,
        organizationId,
    });
    await newBaseUser.save();

    // Send the welcome email with credentials
    sendEmail(
        newBaseUser.email,
        `Your Base Manager Account for ${tenant.name} is Ready`,
        baseUserWelcomeWithCredentialsTemplate({
            baseUserName: firstName,
            npoName: tenant.name,
            loginEmail: newBaseUser.email,
            tempPassword: tempPassword,
        })
    ).catch(err => console.error("Failed to send base user welcome email:", err));
    
    newBaseUser.password = undefined; // Don't send password in the response
    return newBaseUser;
};

/**
 * Retrieves paginated and searchable list of base users for a specific organization.
 * @param {string} organizationId - The ID of the organization.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @param {string} search - The search query string.
 * @returns {Promise<object>} An object containing paginated base user data and total count.
 */
const getAllBasesForOrg = async ({ organizationId, page = 1, limit = 10, search = '' }) => {
  try {
    const query = {
      organizationId,
      role: 'base_user', // Filter for users with the 'base_user' role
    };

    // Implement search logic for relevant fields
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { location: searchRegex }, // Assuming 'location' field exists on base user documents
      ];
    }

    const skip = (page - 1) * limit;

    const bases = await User.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      data: bases,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching bases for organization:", error);
    throw error;
  }
};

module.exports = { registerNewBaseUser, getAllBasesForOrg };