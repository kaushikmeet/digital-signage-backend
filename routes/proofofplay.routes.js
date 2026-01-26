// routes/proofPlay.js
const express = require("express");
const router = express.Router();
const {auth, onlyAdmin} = require("../middleware/auth.middleware");

// Controller function to get proof of play logs
const { getProofOfPlayLogs } = require("../controllers/proofofplay.controller");

// Route to get all proof of play logs
router.get("/", auth, getProofOfPlayLogs);



module.exports = router;
