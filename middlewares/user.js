const { isValidObjectId } = require("mongoose");
const passwordResetTokenModel = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token|| !userId)
    return sendError(res, "Invalid request");

  const resetToken = await passwordResetTokenModel.findOne({ owner: userId });

  if (!resetToken)
    return sendError(res, "Unauthorized access, invalid request ");

  const matched = await resetToken.compaireToken(token);

  if (!matched) return sendError(res, "Unauthorized access, invalid request ");

  req.resetToken = resetToken;

  next();
};
