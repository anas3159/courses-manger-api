const mongoose = require("mongoose");
const validator = require("validator");
const usersRoles = require("../utilies/usersRoles");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "this field must be an email"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [usersRoles.USER, usersRoles.ADMIN, usersRoles.MANGER],
    default: usersRoles.USER,
  },
  token: String,
  avatar: {
    type: String,
    default: "../uploads/androgynous-avatar-non-binary-queer-person.jpg",
  },
});

module.exports = mongoose.model("users", userSchema);
