const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const userService = require('../services/user.service');

const createUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        if (await User.findOne({ email })) {
            throw new ApiError(409, `A user with the email '${email}' already exists.`);
        }
        
        // Create the new user
        const user = await User.create(req.body);
        
        // Don't send the password back in the response
        user.password = undefined; 

        res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
    } catch (error) {
        next(error);
    }
};

const updateMyAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'No file was uploaded.');
        }
        const updatedUser = await userService.updateUserAvatar(req.user.id, req.file.path);
        res.status(200).json(new ApiResponse(200, updatedUser, 'Profile photo updated successfully.'));
    } catch (error) {
        next(error);
    }
};

const updateDetails = async (req, res, next) => {
  try {
    const response = await userService.updateUser(req.params.id, req.body, req.user);
    
    // Send response using ApiResponse (response handler)
    res.status(200).json(new ApiResponse(200, response, 'User details updated successfully.'));
  } catch (error) {
    // Pass error to the next error handler
    next(error);
  }
};

module.exports = {
    createUser,
    updateMyAvatar,
    updateDetails
};
