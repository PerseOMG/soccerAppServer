const AppError = (res, message, status) => {
  return res.status(status).json({ message });
};

module.exports = AppError;
