const { body } = require("express-validator");
const createCourseValidator = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 2 })
    .withMessage("title at least shoud be 2 digits"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price shoud be a number"),
];
module.exports = { createCourseValidator };
