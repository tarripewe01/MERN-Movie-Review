const express = require("express");

const router = express.Router();

const { createActor } = require("../controllers/create");

router.post("/create", createActor);

module.exports = router;
