const httpResText = require("./utilies/htttpResText");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("server started");
});
app.use(cors());
app.use(express.json()); // for using data for post

const courseRouter = require("./routes/coursesRoutes");
const usersRouter = require("./routes/usersRoutes");

app.use("/api/courses", courseRouter);
app.use("/api/users", usersRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res) => {
  res.status(404).json({
    status: httpResText.ERROR,
    message: "this resource not available",
  });
});
//erorr catcher
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.resText || httpResText.ERROR,
    message: error.message,
    statusCode: error.statusCode,
  });
});
app.listen(process.env.PORT || 3000, () => {
  console.log("listeing to port 3000 ");
});
