/**
 * A higher-order function to wrap async route handlers and catch errors.
 * This avoids the need for repetitive try-catch blocks in every controller.
 * @param {Function} requestHandler - The asynchronous controller function to execute.
 * @returns {Function} An Express middleware function that handles promise rejections.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asyncHandler;