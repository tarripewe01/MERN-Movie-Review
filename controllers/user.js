const nodemailer = require("nodemailer");

const UserModel = require("../models/user");
const EmailVerificationTokenModel = require("../models/emailVerificationToken");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError } = require("../utils/helper");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await UserModel.findOne({ email });

  if (oldUser) return sendError(res, "This Email is already in use");

  const newUser = new UserModel({ name, email, password });

  await newUser.save();

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside DB
  const newEmailVerificationToken = new EmailVerificationTokenModel({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send otp to user email
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "admin@verification.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
    <p>Your Verification OTP</p>
    <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email account !!",
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!userId || !OTP)
    return res.status(401).json({ error: "Please provide userId and OTP" });

  const user = await UserModel.findById(userId);
  if (!user) return sendError(res, "User not found !");

  if (user.isVerified) return sendError(res, "User already verified !");

  const token = await EmailVerificationTokenModel.findOne({
    owner: userId,
  });

  if (!token) return sendError(res, "Token not found !");

  const isMatched = await token.compaireToken(OTP);

  if (!isMatched) return sendError(res, "Please submit a valid OTP !");

  user.isVerified = true;

  await user.save();

  // delete token from DB

  await EmailVerificationTokenModel.findByIdAndDelete(token._id);

  // send otp to user email
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "655df9fe8df911",
      pass: "47b0c492b4f3af",
    },
  });

  transport.sendMail({
    from: "admin@verification.com",
    to: user.email,
    subject: "Welcome to Review Movie",
    html: `
    <p>Welcome to ReviewMovie</p>`,
  });
  res.json({ message: "Email verified successfully !" });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) return sendError(res, "User not found !");

  if (user.isVerified) return sendError(res, "User already verified !");

  const alreadyHasToken = await EmailVerificationTokenModel.findOne({
    owner: userId,
  });

  if (alreadyHasToken)
    return sendError(res, "Only after one hour you can resend OTP !");

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside DB
  const newEmailVerificationToken = new EmailVerificationTokenModel({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send otp to user email
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "admin@verification.com",
    to: user.email,
    subject: "Email Verification",
    html: `
    <p>Your Verification OTP</p>
    <h1>${OTP}</h1>
    `,
  });

  res.json({ message: "OTP has been sent to your registered email !" });
};
