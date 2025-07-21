const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

const login = async (req, res, next) => {
    try {
        // Destructure the optional 'role' from the request body
        const { email, password, role } = req.body;
        
        // Pass all three arguments to the service
        const { user, token } = await authService.loginUser(email, password, role);
        
        res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { token: idToken, role  } = req.body;
        const { user, token } = await authService.loginWithGoogle(idToken, role);
        res.status(200).json(new ApiResponse(200, { user, token }, 'Google login successful.'));
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        // We need the frontend's host to create the reset link
        const host = `${req.protocol}://${req.get('host')}`; 
        await authService.forgotPassword(req.body.email, host);
        res.status(200).json(new ApiResponse(200, null, 'If an account with that email exists, a token has been sent.'));
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.params.token, req.body.password);
        res.status(200).json(new ApiResponse(200, null, 'Password reset successful. You can now log in with your new password.'));
    } catch (error) {
        next(error);
    }
};
module.exports = {
    login,
    forgotPassword,
    resetPassword,
    googleLogin
};