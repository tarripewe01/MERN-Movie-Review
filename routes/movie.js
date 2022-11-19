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
const { uploadTrailer } = require("../controllers/movie");

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

// router.post(
//   "/update/:actorId",
//   isAuth,
//   isAdmin,
//   uploadImage.single("avatar"),
//   actorInfoValidator,
//   validate,
//   updateActor
// );

// router.delete("/:actorId", isAuth, isAdmin, removeActor);

// router.get("/search", isAuth, isAdmin, searchActor);

// router.get("/all", isAuth, isAdmin, getAllActors);

// router.get("/:actorId", getActorById);

module.exports = router;
