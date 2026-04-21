const jwt = require("jsonwebtoken");
const httpResText = require("../utilies/htttpResText");
const myError = require("../utilies/errorApp");
const verifyToken = (req, res, next) => {
  const authHeaders =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeaders) {
    myError.create(401, "token is required", httpResText.ERROR);
    return next(myError);
  }
  try {
    const token = authHeaders.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    myError.create(401, "invalid token", httpResText.ERROR);
    return next(myError);
  }
};

module.exports = verifyToken;
