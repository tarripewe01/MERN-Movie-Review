const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGGO_DB_URL)
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((err) => {
    console.log("DB is Connected failed :", err);
  });
