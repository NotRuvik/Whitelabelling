// const jwt = require('jsonwebtoken');
// const ApiError = require('../utils/apiError');
// const User = require('../models/user.model');

// const protect = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//         return next(new ApiError(401, 'You are not logged in. Please log in to get access.'));
//     }

//     try {
//         // 1. Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // 2. Check if user still exists using the ID from the token
//         const currentUser = await User.findById(decoded.id || decoded.userId);

//         if (!currentUser || currentUser.isBlocked) {
//             return next(new ApiError(401, 'The user belonging to this token no longer exists or has been blocked.'));
//         }
//         // 3. Attach the FULL user document from the database to the request object.
//         req.user = currentUser;
        
//         next();
//     } catch (error) {
//         return next(new ApiError(401, 'Not authorized, token is invalid or has expired.'));
//     }
// };

// const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action.'));
//         }
//         next();
//     };
// };

// module.exports = { protect, authorize };
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  // ✅ Extract Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ApiError(
        401,
        'You are not logged in. Please log in to get access.'
      )
    );
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check if user still exists
    const currentUser = await User.findById(decoded.id || decoded.userId);

    if (!currentUser || currentUser.isBlocked) {
      return next(
        new ApiError(
          401,
          'The user belonging to this token no longer exists or has been blocked.'
        )
      );
    }

    // ✅ Attach user
    req.user = currentUser;

    next();
  } catch (error) {
    return next(
      new ApiError(
        401,
        'Not authorized. Token is invalid or has expired.'
      )
    );
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // ✅ Defensive check for req.user
    if (!req.user) {
      return next(
        new ApiError(
          401,
          'Unauthorized. No user information found on request.'
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          'Forbidden: You do not have permission to perform this action.'
        )
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
