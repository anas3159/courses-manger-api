const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const usersController = require("../controller/usersController");
const multer = require("multer");
const myError = require("../utilies/errorApp");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = `user-${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }.${ext}`;
    cb(null, uniqueSuffix);
  },
});
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  console.log(imageType);

  if (imageType == "image") {
    return cb(null, true);
  } else return cb(myError.create(400, "this file must be image"), false);
};
const upload = multer({ storage: diskStorage, fileFilter });

router.route("/").get(verifyToken, usersController.getAllUsers);
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);
router.route("/login").post(usersController.login);

module.exports = router;
