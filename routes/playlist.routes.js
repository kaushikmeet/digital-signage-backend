const router = require("express").Router();
const Playlist = require("../models/Playlist");
const PlaylistItem = require("../models/PlaylistItem");

router.get("/", async (req, res) => {
  const playlists = await Playlist.find();
  res.json(playlists);
});

/* CREATE playlist */
router.post("/", async (req, res) => {
  const playlist = await Playlist.create(req.body);
  res.json(playlist);
});

router.get("/:id/items", async (req, res) => {
  const items = await PlaylistItem
    .find({ playlistId: req.params.id })
    .populate("mediaId")
    .sort({ position: 1 });

  res.json(items);
});

router.post("/items", async (req, res) => {
  const item = await PlaylistItem.create(req.body);

  const io = req.app.get("io");
  io.to(`playlist-${item.playlistId}`).emit("playlist-updated", {
    playlistId: item.playlistId
  });

  res.json(item);
});

router.post("/reorder", async (req, res) => {
  const { playlistId, items } = req.body;

  for (const item of items) {
    await PlaylistItem.findByIdAndUpdate(item.id, {
      position: item.position
    });
  }

  const io = req.app.get("io");
  io.to(`playlist-${playlistId}`).emit("playlist-updated", {
    playlistId
  });

  res.json({ success: true });
});

router.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PlaylistItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🔔 socket notify
    const io = req.app.get("io");
    io.emit("playlist-updated", { playlistId: deleted.playlistId });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
