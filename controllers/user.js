const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");
const EmailVerificationTokenModel = require("../models/emailVerificationToken");
const passwordResetTokenModel = require("../models/passwordResetToken");

const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomBytes } = require("../utils/helper");

exports.create = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    ktp,
    npwp,
    address,
    bank,
    bank_account,
  } = req.body;

  const oldUser = await UserModel.findOne({ email });

  if (oldUser) return sendError(res, "This Email is already in use");

  const newUser = new UserModel({
    name,
    email,
    password,
    phone,
    ktp,
    npwp,
    address,
    bank,
    bank_account,
  });

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
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

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
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
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

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Please provide email");

  const user = await UserModel.findOne({ email });

  if (!user) return sendError(res, "User not found !");

  const alreadyHasToken = await passwordResetTokenModel.findOne({
    owner: user._id,
  });

  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token !"
    );

  const token = await generateRandomBytes();
  const newPasswordResetToken = await passwordResetTokenModel({
    owner: user._id,
    token,
  });

  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password/?token=${token}&id=${user._id}`;

  // send otp to user email
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

  transport.sendMail({
    from: "admin@security.com",
    to: user.email,
    subject: "Reset Password",
    html: `
    <p>Reset Password</p>
    <a href="${resetPasswordUrl}">Click here to reset password</a>
    
    
    `,
  });

  res.json({ message: "Reset password link has been sent to your email !" });
};

exports.sendResetPasswordTokenStatus = async (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await UserModel.findById(userId);

  const matched = await user.compairePassword(newPassword);

  if (matched)
    return sendError(
      res,
      "The new password must be different from the old password"
    );

  user.password = newPassword;

  await user.save();

  await passwordResetTokenModel.findByIdAndDelete(req.resetToken._id);

  // send otp to user email
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

  transport.sendMail({
    from: "admin@security.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
      <h1>Password Reset Successfully</h1>
      <p>Now you can use new password.</p>
      `,
  });

  res.json({
    message: "Password reset successfully, now you can use new password.",
  });
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) return sendError(res, "Email or Password mismatch");

  const matched = await user.compairePassword(password);

  if (!matched)
    return sendError(
      res,
      "The new password must be different from the old password"
    );

  const {
    _id,
    name,
    role,
    isVerified,
    phone,
    address,
    ktp,
    npwp,
    bank,
    bank_account,
  } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET, {
    expiresIn: "7h",
  });

  res.json({
    user: {
      id: _id,
      name,
      email,
      role,
      phone,
      address,
      ktp,
      npwp,
      bank,
      bank_account,
      isVerified,
      token: jwtToken,
    },
  });
};
