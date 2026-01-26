const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth.middleware");

const {
  getSummary,
  getKpis,
  playsByMedia,
  playsByScreen,
  dailyTrend,
  logPlay
} = require("../controllers/analytics.controller");


router.get("/log", auth, logPlay);
/* ===========================
   ANALYTICS DASHBOARD
=========================== */

// High-level dashboard summary
router.get("/summary", auth, adminOnly, getSummary);

// KPI metrics (filters: screenId, from, to)
router.get("/kpis", auth, adminOnly, getKpis);

// Plays grouped by media
router.get("/media", auth, adminOnly, playsByMedia);

// Plays grouped by screen
router.get("/screens", auth, adminOnly, playsByScreen);

// Daily playback trend
router.get("/daily", auth, adminOnly, dailyTrend);

module.exports = router;
