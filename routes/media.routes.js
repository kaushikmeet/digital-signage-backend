const router = require("express").Router();
const upload = require("../middleware/upload");
const Media = require("../models/Media");

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const type = req.file.mimetype.startsWith("image")
    ? "image"
    : "video";

  const media = await Media.create({
    filename: req.file.originalname,
    type,
    url: `http://localhost:8080/uploads/${req.file.filename}`, // 🔴 FIX
    size: req.file.size,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  res.json(media);
});


router.get("/", async (_, res) => {
  res.json(await Media.find());
});

module.exports = router;
