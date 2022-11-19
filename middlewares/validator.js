const { check, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing !"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
];

exports.validatePassword = [
  check("newPassword")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !"),
];

exports.signInValidator = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid !"),
  check("password").trim().not().isEmpty().withMessage("Password is missing !"),
];

exports.actorInfoValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is missing !"),
  check("about")
    .trim()
    .not()
    .isEmpty()
    .withMessage("About is required field !"),
  check("gender")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Gender is required field !"),
];

exports.movieInfoValidator = [
  check("title").trim().not().isEmpty().withMessage("Title is missing !"),
  check("storyLine")
    .trim()
    .not()
    .isEmpty()
    .withMessage("StoryLine is important !"),
  check("languange")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Languange is missing !"),
  check("releaseDate").isDate().withMessage("releaseDate is missing !"),
  check("status")
    .isIn(["public", "provate"])
    .withMessage("Movie status must be public or private !"),
  check("type").trim().not().isEmpty().withMessage("Movie type is missing !"),
  check("genres")
    .isArray()
    .withMessage("Genres must be an array of strings !")
    .custom((genres) => {
      (value) => {
        for (let g of value) {
          if (!genres.includes(g)) throw Error("Invalid Genres !");
        }
      };
    }),
  check("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be an array of strings !")
    .custom((tags) => {
      for (let tag of tags) {
        if (typeof tag !== "string") throw Error("Invalid Tags !");
      }
    }),
  check("cast")
    .isArray()
    .withMessage("Cast must be an array of strings !")
    .custom((cast) => {
      for (let c of cast) {
        if (!isValidObjectId(c.id))
          throw Error("Invalid Cast id inside cast !");
        if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast !");
        if (typeof c.leadActor !== "boolean")
          throw Error(
            "Only accepted boolean value inside leadActor inside cast !"
          );
      }
    }),
  check("trailerInfo")
    .isObject()
    .withMessage("TrailerInfo must be an object with url and public_id !")
    .custom(({ url, public_id }) => {
      try {
        const result = new URL(url);
        if (!result.protocol.startsWith("http"))
          throw Error("Trailer url is invalid !");

        const arr = url.split("/");
        const publicId = arr[arr.length - 1].split(".")[0];

        if (publicId !== public_id)
          throw Error("Trailer public_id is invalid !");
      } catch (error) {
        throw Error("Trailer url is invalid !");
      }
    }),
  check("poster").custom((_, { req }) => {
    if (!req.file) throw Error("Poster file is missing !");
  }),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(400).json({ error: errors[0].msg });
  }
  console.log(errors);

  next();
};
