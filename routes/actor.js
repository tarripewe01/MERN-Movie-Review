const express = require("express");

const router = express.Router();

const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getAllActors,
} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");

router.post(
  "/create",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

router.post(
  "/update/:actorId",
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", removeActor);

router.get("/search", searchActor);

router.get("/all", getAllActors);

module.exports = router;
