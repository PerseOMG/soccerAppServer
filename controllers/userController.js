const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");
const updateById = require("./factories/updateById.factory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      AppError(
        res,
        "This route is not for password updates. Please use the right one. ",
        400
      )
    );
  }
  // Update user document

  // We grab only the authorized fields for the user to update
  const filteredBody = filterObj(req.body, "name", "email");
  // We use this method because if not (instead use .save()) will give us an error because confirmPassword is required
  const updatedUser = updateById(User, req.user.id, filteredBody);

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
