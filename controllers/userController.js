const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};

exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined",
    });
};

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: { users },
    });
});

exports.updateMe = catchAsync(async(req, res, next) => {
    // Create error if user post password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password updates. Please use the right one. ",
                400
            )
        );
    }
    // Update user document

    // We grab only the authorized fields for the user to update
    const filteredBody = filterObj(req.body, "name", "email");
    // We use this method because if not (instead use .save()) will give us an error because confirmPassword is required
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            updatedUser,
        },
    });
});