const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing !"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
];

exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("password").trim().not().isEmpty().withMessage("Password is missing !"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ error: errors[0].msg });
  }
  console.log(errors);

  next();
};
