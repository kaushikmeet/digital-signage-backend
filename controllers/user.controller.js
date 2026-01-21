const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id, "-password");
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
