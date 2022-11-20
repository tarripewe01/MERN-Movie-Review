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
const { uploadTrailer, createMovie, updateMovieWithoutPoster } = require("../controllers/movie");
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

// patch utk ubah beberapa field & put utk ubah semua field
router.patch(
  "/update-movie-without-poster/:movieId",
  isAuth,
  isAdmin,
  // parseData,
  movieInfoValidator,
  validate,
  updateMovieWithoutPoster
);

module.exports = router;
