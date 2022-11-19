const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  const token = req.headers?.authorization;

  const jwtToken = token?.split("Bearer")[1];

  if (!jwtToken) return sendError(res, "Invalid Token");

  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);

  const { userId } = decode;

  const user = await UserModel.findById(userId);
  if (!user) return sendError(res, "unauthorized access !");

  req.user = user;

  next();
};
