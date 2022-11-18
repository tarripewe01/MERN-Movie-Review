const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");

require("dotenv").config();
require("express-async-errors");

require("./db");

const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);

app.use(errorHandler);

app.listen(9999, () => {
  console.log("Running on port 9999");
});
