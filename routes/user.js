const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user");


router.post("/user-create", createUser)

module.exports = router;
