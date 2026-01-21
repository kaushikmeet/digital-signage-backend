const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  }
});

module.exports = multer({ storage });
