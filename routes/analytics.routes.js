const router = require("express").Router();
const {auth, adminOnly} = require("../middleware/auth.middleware");
const {getSummary} = require("../controllers/analytics.controller");

/* GET ANALYTICS SUMMARY (admin) */ 
router.get("/summary", auth, adminOnly, getSummary);

module.exports = router;
