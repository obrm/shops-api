import User from '../models/User.js';

import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from './../middleware/asyncHandler.js';

import sendTokenResponse from "../utils/sendTokenResponse.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check matching password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Important to return the same error message so no one can know the reason for login failure
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict' // to prevent CSRF (Cross-Site Request Forgery) attacks
    /*
     CSRF is a type of web security vulnerability that allows an attacker to perform unwanted actions on behalf of an authenticated user. The attack occurs when a malicious website or script makes a request to a legitimate website where the user is already authenticated.
  */
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/current-user
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

