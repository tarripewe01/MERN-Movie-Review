const express = require("express");

const userRouter = require("./routes/user");

const app = express();

app.use("/user", userRouter);

app.listen(9999, () => {
  console.log("Running on port 9999");
});
