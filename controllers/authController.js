// Models
const User = require("../models/userModel");

// Packages
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

// Utilities
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const sendEmail = require("../utils/email.util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // const cookieOptions = {
  //     expires: new Date(
  //         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //     ),
  //     httpOnly: true,
  //     domain: "localhost:4200",
  //     sameSite: "none",
  // };

  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  user.password = undefined;

  // res.cookie("AppSoccerJwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let newUser;
  try {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);
    return next(
      AppError(
        res,
        `${err.keyValue.name ? "Username" : "Email"} ${
          err.keyValue.name ?? err.keyValue.email
        } is already in use`,
        400
      )
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(AppError(res, "Please provide Email and Password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(AppError(res, "Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      AppError(res, "You are not logged in! Please login to get access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      AppError(
        res,
        "The user belonging to the token does no longer exist. ",
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      AppError(res, "User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        AppError(
          res,
          "You do not have permission to perform this action. ",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      AppError(res, "There is no user with provided email address", 404)
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password?? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you didn't forget your password, please ignore this email! `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      AppError(
        res,
        "There was an error sending the email. Try Again Later.",
        500
      )
    );
  }
  res.status(200).json({ status: "success", message: "Token Sent to Email" });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(AppError(res, "Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2 Check if user posted pass is right
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(AppError(res, "The current password is wrong", 404));
  }

  // 3 update pass
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // User.findByIdAndUpdate will not work

  // 4 Log user in
  createSendToken(user, 200, res);
});
