const router = require("express").Router();
const {auth, adminOnly} = require("../middleware/auth.middleware");
const {createScreen, getScreens, deleteScreen, getScreenById, bulkDeleteScreens, assignScreenToPlaylist, fallbackMediaUpdate} = require("../controllers/screen.controller");

/* CREATE SCREEN */
router.get("/", auth, getScreens);
router.post("/", auth, createScreen);
router.post("/assign-playlist", auth, adminOnly, assignScreenToPlaylist);
router.delete("/:id", auth, adminOnly, deleteScreen);
router.delete("/bulk-delete", auth, adminOnly, bulkDeleteScreens);
router.get("/:id", auth, getScreenById);
router.get("/:id/fallback-media", auth, fallbackMediaUpdate);  

module.exports = router;
