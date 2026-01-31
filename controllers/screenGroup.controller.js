const ScreenGroup = require("../models/screenGroup.model.js");
const Screen = require("../models/Screen");

/* ---------------- CREATE GROUP ---------------- */
exports.createGroup = async (req, res) => {
  try {
    const {name, layout, playlistId} = req.body;
    const group = await ScreenGroup.create({
      name,
      layout,
      playlistId
    });
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* ---------------- GET ALL GROUPS ---------------- */
exports.getGroups = async (req, res) => {
  try {
    const groups = await ScreenGroup.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to load groups" });
  }
};

/* ---------------- GET SINGLE GROUP ---------------- */
exports.getGroup = async (req, res) => {
  const group = await ScreenGroup.findById(req.params.id)
    .populate("screens")
    .populate("playlistId");

  if (!group) return res.sendStatus(404);
  res.json(group);
}

/* ---------------- UPDATE GROUP LAYOUT ---------------- */
exports.updateGroupLayout = async (req, res) => {
  const { groupId } = req.params;
  const { layout } = req.body;

  const group = await ScreenGroup.findByIdAndUpdate(
    groupId,
    { layout },
    { new: true }
  );

  req.io.to(`group-${groupId}`).emit("group-layout-updated", {
    groupId,
    layout
  });

  res.json(group);
};

/* ---------------- ASSIGN SCREENS TO GROUP ---------------- */
exports.assignScreens = async (req, res) => {
  const { screenIds } = req.body;

  const group = await ScreenGroup.findByIdAndUpdate(
    req.params.id,
    { screens: screenIds },
    { new: true }
  );

  res.json(group);
};

/* ---------------- UPDATE GROUP PLAYLIST ---------------- */
exports.updateGroupPlaylist = async (req, res) => {
  const { playlistId } = req.body;

  const group = await ScreenGroup.findByIdAndUpdate(
    req.params.id,
    { playlistId },
    { new: true }
  );

  res.json(group);
}

