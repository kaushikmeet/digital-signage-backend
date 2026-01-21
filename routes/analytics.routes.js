const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/summary", auth, async (req, res) => {
  res.json({
    totalPlays: 120,
    topMedia: [
      { _id: "video1.mp4", plays: 55 },
      { _id: "image2.jpg", plays: 65 }
    ]
  });
});

module.exports = router;
