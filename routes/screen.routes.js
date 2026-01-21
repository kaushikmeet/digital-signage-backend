const router = require("express").Router();
const Screen = require("../models/Screen");

const {auth, adminOnly} = require("../middleware/auth.middleware");
const {createScreen, getScreens, deleteScreen} = require("../controllers/screen.controller");

/* CREATE SCREEN */
router.get("/", auth, getScreens);
router.post("/", auth, adminOnly, createScreen);
router.delete("/:id", auth, adminOnly, deleteScreen);
  

module.exports = router;
