const asyncWrapper = require("../middleware/aysncWrapper");
const user = require("../models/userModel");
const httpResText = require("../utilies/htttpResText");
const myError = require("../utilies/errorApp");
const bcrypt = require("bcryptjs");
const aysncWrapper = require("../middleware/aysncWrapper");
const generateJWT = require("../utilies/generateJWT");
const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await user
    .find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpResText.SUCCESS, data: { users } });
});
const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await user.findOne({ email: email });
  if (oldUser) {
    myError.create(400, "email is already exist", httpResText.FAIL);
    return next(myError);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new user({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.fil,
  });
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();
  res.status(201).json({ status: httpResText.SUCCESS, data: { newUser } });
});
const login = aysncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const myuser = await user.findOne({ email: email });
  if (!myuser) {
    myError.create(404, "user not found", httpResText.ERROR);
    return next(myError);
  }
  const matchedPassword = await bcrypt.compare(password, myuser.password);
  if (myuser && matchedPassword) {
    const token = await generateJWT({
      email: myuser.email,
      id: myuser._id,
      role: myuser.role,
    });
    myuser.token = token;
    return res.status(200).json({
      status: httpResText.SUCCESS,
      data: { token },
    });
  } else myError.create(500, "something wrong", httpResText.ERROR);
  return next(myError);
});
module.exports = {
  getAllUsers,
  register,
  login,
};
