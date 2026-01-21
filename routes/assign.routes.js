const express = require("express");
const router = express.Router();
const ScreenPlaylist = require("../models/ScreenPlaylist");
const debounceEmit = require("../utils/debounceSocket");

router.post("/", async (req, res) => {
  const { screenId, playlistId } = req.body;

  const mapping = await ScreenPlaylist.findOneAndUpdate(
    { screenId },
    { playlistId },
    { new: true }
  );

  if (!mapping) {
    return res.status(404).json({ error: "Screen not found" });
  }

  debounceEmit(
    req.app.get("io"),
    `screen-${screenId}`,
    "playlist-updated",
    300
  );

  res.json({ success: true });
});

module.exports = router;
