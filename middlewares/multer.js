const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb("Not an image! Please upload an image", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter });
