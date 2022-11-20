const crypto = require("crypto");

exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

exports.generateRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, async (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      console.log(buffString);
      resolve(buffString);
    });
  });
};

exports.parseData = (req, res, next) =>{
  const {trailer, cast, genres, tags, writers} = req.body;

  if(trailer) req.body.trailer = JSON.parse(trailer);
  if(cast) req.body.cast = JSON.parse(cast);
  if(genres) req.body.genres = JSON.parse(genres);
  if(tags) req.body.tags = JSON.parse(tags);
  if(writers) req.body.writers = JSON.parse(writers);

  next();
}
