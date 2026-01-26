const router = require("express").Router();
const playlistController = require("../controllers/playlist.controller");
const { auth, adminOnly } = require("../middleware/auth.middleware");

/* ---------------- PLAYLISTS ---------------- */

// create playlist
router.post("/", auth, playlistController.createPlaylist);

// get all playlists
router.get("/", auth, playlistController.getAllPlaylists);

// get playlist items
router.get("/:id/items", auth, playlistController.getPlaylistItems);

// get active items (schedule-aware)
router.get("/:id/active-items", auth, playlistController.ActivePlayListItem);


/* ---------------- PLAYLIST ITEMS ---------------- */

// create playlist item
router.post("/items", auth, playlistController.createPlayListItem);

// get single playlist item
router.get("/items/:id", auth, playlistController.getPlayListItemById);

// update playlist item (general)
router.put("/items/:id", auth, adminOnly, playlistController.updatePlayListItem);

// delete playlist item
router.delete("/items/:id", auth, playlistController.deletePlayListItem);

// reorder items
router.put("/items/reorder", auth, playlistController.createReorderItems);

// schedule playlist item
router.put("/items/:id/schedule", auth, playlistController.updatePlaylistItemSchedule);

module.exports = router;
