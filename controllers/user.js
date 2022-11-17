const UserModel = require("../models/user");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await UserModel.findOne({ email });

  if (oldUser)
    return res.status(401).json({ error: "This Email is already in use" });

  const newUser = new UserModel({ name, email, password });

  await newUser.save();

  res.status(201).json({ user: newUser });
};
