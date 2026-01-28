const router = require("express").Router();
const controller = require("../controllers/media.controller");
const {auth, adminOnly} = require("../middleware/auth.middleware");

router.post("/createMedia", auth, controller.createMedia);
router.get("/", auth, controller.getMedia);
router.post("/upload", auth, controller.uploadMedia);

module.exports = router;
