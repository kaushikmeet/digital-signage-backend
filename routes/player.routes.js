const express = require("express");
const router = express.Router();
const ScreenPlaylist = require("../models/ScreenPlaylist");
const PlaylistItem = require("../models/PlaylistItem");

router.get("/:screenId", async (req, res) => {
  try {
    const { screenId } = req.params;

    console.log("▶ Player request for screen:", screenId);

    const mapping = await ScreenPlaylist.findOne({ screenId });

    if (!mapping) {
      console.log("❌ No mapping for screen:", screenId);
      return res.json([]);   // IMPORTANT
    }

    const items = await PlaylistItem.find({
      playlistId: mapping.playlistId
    })
      .populate("mediaId")
      .sort({ position: 1 });

    const timeline = items
      .filter(i => i.mediaId) // PROTECT
      .map(i => ({
        url: i.mediaId.url,
        type: i.mediaId.type,
        duration: i.duration
      }));

    console.log("✅ Timeline length:", timeline.length);

    res.json(timeline);
  } catch (err) {
    console.error("🔥 PLAYER ROUTE ERROR:", err);
    res.status(500).json({ error: "Player failed" });
  }
});

module.exports = router;
