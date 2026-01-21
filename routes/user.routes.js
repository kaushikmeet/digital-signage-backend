const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth.middleware.js");

/* GET ALL USERS (admin) */
router.get("/", auth(["admin"]), async (req, res) => {
  const users = await User.find({}, "-password");
  res.json(users);
});

/* DELETE USER */
router.delete("/:id", auth(["admin"]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
