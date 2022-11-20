const express = require("express");

const router = express.Router();

const { uploadImage, uploadVideo } = require("../middlewares/multer");
const { isAuth, isAdmin } = require("../middlewares/auth");
const {
  uploadTrailer,
  createMovie,
  updateMovieWithoutPoster,
  updateMovieWithPoster,
} = require("../controllers/movie");
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

router.patch(
  "/update-movie-with-poster/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  movieInfoValidator,
  validate,
  updateMovieWithPoster
);

module.exports = router;
