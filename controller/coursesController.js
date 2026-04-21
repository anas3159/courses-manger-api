const { validationResult } = require("express-validator");
const course = require("../models/courseModel");
const httpResText = require("../utilies/htttpResText");
const asyncWrapper = require("../middleware/aysncWrapper");
const myError = require("../utilies/errorApp");
const getAllcourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpResText.SUCCESS, data: { courses } });
});
const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const myCourse = await course.findById(req.params.courseId);
  if (!myCourse) {
    myError.create(404, "course not found", httpResText.FAIL);
    return next(myError);
  }
  return res.json({
    status: httpResText.SUCCESS,
    data: { course: myCourse },
  });
});
const createNewCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    myError.create(400, errors.array(), httpResText.ERROR);
    return next(myError);
  }

  const newCourse = new course(req.body);
  await newCourse.save();
  res.status(201).json({ status: httpResText.SUCCESS, data: { newCourse } });
});
const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const courseBeforeUpdate = await course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });
  res.status(200).json({
    status: httpResText.SUCCESS,
    data: { courseBeforeUpdate },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  await course.deleteOne({ _id: courseId });
  res.status(200).json({ status: httpResText.SUCCESS, data: null });
});
module.exports = {
  getAllcourses,
  getSingleCourse,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
