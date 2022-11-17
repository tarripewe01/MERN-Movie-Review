const express = require("express");

require("./db");

const userRouter = require("./routes/user");

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);

app.listen(9999, () => {
  console.log("Running on port 9999");
});
