const Media = require("../models/Media");
const sanitizeHtml = require("sanitize-html");

exports.createMedia = async (req, res) => {
  try {
    const { title, type, url, content, duration, meta } = req.body;

    if (["text", "html"].includes(type) && !content) {
      return res.status(400).json({ error: "Content required" });
    }

    let safeContent = content;

    if (type === "html") {
      safeContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "style",
          "iframe",
          "div",
          "span"
        ]),
        allowedAttributes: {
          "*": ["style", "class"],
          img: ["src", "alt"],
          iframe: ["src", "width", "height"]
        },
        allowedSchemes: ["http", "https", "data"]
      });
    }

    const media = await Media.create({
      title,
      type,
      url,
      content: safeContent, // ✅ SAFE HTML STORED
      duration,
      meta
    });

    res.json(media);
  } catch (err) {
    console.error("Create media error:", err);
    res.status(500).json({ error: "Failed to create media" });
  }
};


exports.uploadMedia = async(req,res)=>{
    if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const type = req.file.mimetype.startsWith("image")
    ? "image"
    : "video";

  const media = await Media.create({
    filename: req.file.originalname,
    type,
    url: `http://localhost:8080/uploads/${req.file.filename}`,
    size: req.file.size,
  });

  res.json(media);
};

exports.getMedia = async (req, res)=>{
    res.json(await Media.find());
}
