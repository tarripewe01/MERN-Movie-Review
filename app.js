const express = require("express");
const morgan = require("morgan");

require("./db");

const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);

app.listen(9999, () => {
  console.log("Running on port 9999");
});
