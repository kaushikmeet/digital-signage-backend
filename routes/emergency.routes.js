const router = require("express").Router();
const {auth, adminOnly} = require("../middleware/auth.middleware");
const {activateEmergency, clearEmergency, triggerEmergency} = require("../controllers/emergency.controller");

router.post("/activate", auth, adminOnly, activateEmergency);
router.post("/clear", auth, adminOnly, clearEmergency);
router.post("/trigger", auth, adminOnly, triggerEmergency);

module.exports = router;