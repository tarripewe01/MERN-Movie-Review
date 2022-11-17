const express = require("express");

const router = express.Router();

const { userValidator, validate } = require("../middlewares/validator");

const { create, verifyEmail } = require("../controllers/user");

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);

module.exports = router;
