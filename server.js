require("dotenv").config({ path: "./config/.env" });
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./socket");

const server = http.createServer(app);

/* ---------- SOCKET.IO ---------- */
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

/* make io available everywhere */
app.set("io", io);

/* socket events */
initSocket(io);

/* ---------- START ---------- */
connectDB();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);
