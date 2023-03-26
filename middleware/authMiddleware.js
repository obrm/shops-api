import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // We can access the token from the header
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Format the token - remove the word Bearer from the string 'Bearer ljoewfdw789032547ewhjlkfdhweo894r230ljhnrfd'
    // so it will be ['Bearer', 'ljoewfdw789032547ewhjlkfdhweo894r230ljhnrfd']
    // and then we take the index 1 that holds the string with only the token
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    // 401 - Not found
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
// Pass in a comma separated list of roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }
    next();
  };
};
