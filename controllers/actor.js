const ActorModel = require("../models/actor");

const { sendError } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

exports.createActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new ActorModel({ name, about, gender });

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );

    newActor.avatar = { url: secure_url, public_id };
  }

  await newActor.save();

  res.status(201).json({
    id: newActor._id,
    name,
    about,
    gender,
    avatar: newActor.avatar?.url,
  });
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request");

  const actor = await ActorModel.findById(actorId);
  if (!actor) return sendError(res, "Actor not found");

  const public_id = actor.avatar?.public_id;

  // remove old Image
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud");
  }

  // upload new image
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );

    actor.avatar = { url: secure_url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json({
    id: actor._id,
    name,
    about,
    gender,
    avatar: actor.avatar?.url,
  });
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request");

  const actor = await ActorModel.findById(actorId);
  if (!actor) return sendError(res, "Actor not found");

  const public_id = actor.avatar?.public_id;

  // remove Image from cloud
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud");
  }

  await ActorModel.findByIdAndDelete(actorId);

  res.status(200).json({ message: "Actor deleted successfully" });
};

exports.searchActor = async (req, res) => {
  const { query } = req;

  const result = await ActorModel.find({
    $text: { $search: `"${query.name}"` },
  });

  res.status(200).json(result);
};

exports.getAllActors = async (req, res) => {
  const result = await ActorModel.find().sort({ createdAt: -1 }).limit(10);

  res.status(200).json(result);
};

exports.getActorById = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid Request");

  const actor = await ActorModel.findById(actorId);

  if (!actor) return sendError(res, "Actor not found", 404);

  res.json(actor);
};
