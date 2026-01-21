const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth.middleware");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");

router.get("/", auth, adminOnly, getUsers);
router.get("/:id", auth, adminOnly, getUserById);
router.put("/:id", auth, adminOnly, updateUser);
router.delete("/:id", auth, adminOnly, deleteUser);

module.exports = router;
