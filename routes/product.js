const express = require("express");

const router = express.Router();

const {
  createProduct,
  updateProduct,
  removeProduct,
  getAllProducts,
  getProductById,
  searchProduct,
  bidProduct,
} = require("../controllers/product");
const { isAuth } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");

router.post(
  "/create",
  uploadImage.single("avatar"),
  //   actorInfoValidator,
  validate,
  createProduct
);

router.post(
  "/update/:productId",
  uploadImage.single("avatar"),
  //   actorInfoValidator,
  validate,
  updateProduct
);

router.delete("/:productId", removeProduct);

router.get("/search", searchProduct);

router.get("/all", getAllProducts);

router.get("/:productId", getProductById);

router.post("/bid/:id",isAuth, bidProduct);

module.exports = router;
