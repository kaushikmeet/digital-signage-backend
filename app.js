const express = require("express");
const cors = require("cors");
const path = require("path");

const screenRoutes = require("./routes/screen.routes");
const playlistRoutes = require("./routes/playlist.routes");
const mediaRoutes = require("./routes/media.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const screenGroupRoute = require("./routes/screenGroup.routes");


const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

/* ---------- ROUTES ---------- */
app.use("/screens", screenRoutes);
app.use("/playlists", playlistRoutes);
app.use("/media", mediaRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/emergency", require("./routes/emergency.routes"));
app.use("/screen-groups", screenGroupRoute);

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("✅ Digital Signage Backend Running");
});

module.exports = app;
