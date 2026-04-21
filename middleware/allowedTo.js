const myError = require("../utilies/errorApp");
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(myError.create(401, "this role is not authorized"));
    } else next();
  };
};
