const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://movie_review:geXs8c9qFBhjeZTw@mern.golbvqb.mongodb.net/Movie_Review?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is Connected");
  })
  .catch((err) => {
    console.log("DB is Connected failed :", err);
  });
