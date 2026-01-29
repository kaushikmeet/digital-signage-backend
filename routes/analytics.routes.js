const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth.middleware");

const {
  getSummary,
  getKpis,
  playsByMedia,
  playsByScreen,
  dailyTrend,
  logPlay,
  exportCsv,
  revenueByMedia,
  bestTimeSlots,
  analyticsByScreen,
  bestHours,
  analyticsByZone
} = require("../controllers/analytics.controller");

/* ===========================
   ANALYTICS LOGGING (PLAYER)
=========================== */

// Proof-of-play / analytics logging
router.post("/log", auth, logPlay);

/* ===========================
   ANALYTICS DASHBOARD (ADMIN)
=========================== */

// High-level summary
router.get("/summary", auth, adminOnly, getSummary);

// KPI metrics (filters: screenId, from, to)
router.get("/kpis", auth, adminOnly, getKpis);

// Plays grouped by media
router.get("/media", auth, adminOnly, playsByMedia);

// Plays grouped by screen
router.get("/screens", auth, adminOnly, playsByScreen);

// Daily playback trend
router.get("/daily", auth, adminOnly, dailyTrend);

// Per-screen analytics
router.get("/screen/:screenId", auth, adminOnly, analyticsByScreen);

// Revenue grouped by media
router.get("/revenue", auth, adminOnly, revenueByMedia);

// Best time slots (days)
router.get("/best-timeslot", auth, adminOnly, bestTimeSlots);

// Best hours of the day
router.get("/best-hours", auth, adminOnly, bestHours);

// Export analytics as CSV
router.get("/export/csv", auth, adminOnly, exportCsv);

router.get("/zone/:id", auth, analyticsByZone);

module.exports = router;
