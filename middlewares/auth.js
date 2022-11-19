const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const UserModel = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  const jwtToken = token;

  if (!jwtToken) return sendError(res, "Invalid Token");

  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);

  const { userId } = decode;

  const user = await UserModel.findById(userId);
  if (!user) return sendError(res, "unauthorized access !");

  req.user = user;

  next();
};

exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") return sendError(res, "unauthorized access !");

  next();
};
