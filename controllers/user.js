exports.create = async (req, res) => {
  console.log(req.body);
  res.json({ user: req.body });
};
