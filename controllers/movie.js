const { isValidObjectId } = require("mongoose");
const MovieModel = require("../models/movie");
const { sendError } = require("../utils/helper");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

exports.uploadTrailer = async (req, res) => {
  const { file } = req;

  if (!file) return sendError(res, "Video file is missing");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );

  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,

    languange,
  } = body;

  const newMovie = new MovieModel({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    languange,
  });

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid Director id !");
    newMovie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid Writer id !");
    }
    newMovie.writers = writers;
  }

  // uploading poster
  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(file.path, {
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_image: 3,
      transformation: {
        width: 1280,
        height: 720,
      },
    },
  });

  const finalPoster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];

  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push({ secure_url });
    }
  }

  newMovie.poster = finalPoster;

  await newMovie.save();

  res.status(201).json({
    id: newMovie._id,
    title: newMovie.title,
    storyLine: newMovie.storyLine,
    releaseDate: newMovie.releaseDate,
    status: newMovie.status,
    type: newMovie.type,
    genres: newMovie.genres,
    tags: newMovie.tags,
    cast: newMovie.cast,
    trailer: newMovie.trailer,
    languange: newMovie.languange,
    director: newMovie.director,
    writers: newMovie.writers,
    poster: newMovie.poster,
  });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie id !");

  if (!req.file) return sendError(res, "Poster is missing !");

  const movie = await MovieModel.findById(movieId);
  if (!movie) return sendError(res, "Movie not found !", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    languange,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.languange = languange;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid Director id !");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid Writer id !");
    }
    movie.writers = writers;
  }

  // update poster
  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);

    if (result !== "ok") {
      return sendError(res, "Could not update the poster at the moment !");
    }
  }

  // uploading poster
  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(req.file.path, {
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_image: 3,
      transformation: {
        width: 1280,
        height: 720,
      },
    },
  });

  const finalPoster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];

  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push({ secure_url });
    }
  }

  movie.poster = finalPoster;

  await movie.save();

  res.status(200).json({ message: "Movie updated successfully !" });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie id !");

  const movie = await MovieModel.findById(movieId);
  if (!movie) return sendError(res, "Movie not found !", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    languange,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.languange = languange;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid Director id !");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid Writer id !");
    }
    movie.writers = writers;
  }

  await movie.save();

  res.status(200).json({ message: "Movie updated successfully !" });
};
