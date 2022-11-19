const express = require("express");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");

require("dotenv").config();
require("express-async-errors");

require("./db");

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const productRouter = require("./routes/product");
const movieRouter = require("./routes/movie");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/product", productRouter);
app.use("/api/movie", movieRouter);

app.use(errorHandler);

app.listen(9999, () => {
  console.log("Running on port 9999");
});
