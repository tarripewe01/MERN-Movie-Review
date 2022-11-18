const express = require("express");

const router = express.Router();

const { userValidator, validate } = require("../middlewares/validator");

const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
} = require("../controllers/user");
const { isValidPasswordResetToken } = require("../middlewares/user");

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPasswordResetToken,
  (req, res) => {
    res.json({ valid: true });
  }
);

module.exports = router;
