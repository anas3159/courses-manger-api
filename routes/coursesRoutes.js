const express = require("express");
const router = express.Router();
const courseController = require("../controller/coursesController");
const usersRoles = require("../utilies/usersRoles");
const allowedTo = require("../middleware/allowedTo");
const {
  createCourseValidator,
} = require("../validators/createCourseValidator");
const verifyToken = require("../middleware/verifyToken");

router
  .route("/")
  .get(courseController.getAllcourses)
  .post(verifyToken, createCourseValidator, courseController.createNewCourse);
router
  .route("/:courseId")
  .get(courseController.getSingleCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(usersRoles.ADMIN, usersRoles.MANGER),
    courseController.deleteCourse
  );
module.exports = router;
