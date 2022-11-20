const express = require("express");

const router = express.Router();

const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getAllActors,
  getActorById,
} = require("../controllers/actor");

const { uploadImage, uploadVideo } = require("../middlewares/multer");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadTrailer, createMovie } = require("../controllers/movie");
const { parseData } = require("../utils/helper");
const { validate, movieInfoValidator } = require("../middlewares/validator");

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  movieInfoValidator,
  validate,
  createMovie
);

// router.delete("/:actorId", isAuth, isAdmin, removeActor);

// router.get("/search", isAuth, isAdmin, searchActor);

// router.get("/all", isAuth, isAdmin, getAllActors);

// router.get("/:actorId", getActorById);

module.exports = router;
