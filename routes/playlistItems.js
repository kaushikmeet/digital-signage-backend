const express = require("express");
const debounceEmit = require("../utils/debounceSocket");
const PlaylistItem = require("../models/PlaylistItem");

const router = express.Router();
/* ---------- REORDER PLAYLIST ITEMS ---------- */
router.post("/reorder", async (req, res) => {
  try {
    const { playlistId, items } = req.body;

    if (!playlistId || !items) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const bulkOps = items.map(i => ({
      updateOne: {
        filter: { _id: i.id, playlistId },
        update: { $set: { position: i.position } }
      }
    }));

    await PlaylistItem.bulkWrite(bulkOps);

    // 🔔 SOCKET EMIT
    req.io.to(`playlist-${playlistId}`).emit("playlist-updated", {
      playlistId
    });

    res.json({ success: true });
  } catch (err) {
    console.error("REORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;