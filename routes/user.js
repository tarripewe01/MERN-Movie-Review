const express = require("express");

const router = express.Router();

const { userValidator, validate } = require("../middlewares/validator");

const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
} = require("../controllers/user");

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);

module.exports = router;
