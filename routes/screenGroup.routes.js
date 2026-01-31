const router = require("express").Router();
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroupLayout,
  assignScreens,
  updateGroupPlaylist
} = require ("../controllers/screenGroup.controller.js");

// const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:id", getGroup);
router.put("/:id/layout", updateGroupLayout);
router.put("/:id/screens", assignScreens);
router.put("/:id/playlist", updateGroupPlaylist);

module.exports = router;
