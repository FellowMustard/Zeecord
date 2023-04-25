const express = require("express");
const {
  registerUser,
  getUserProfile,
  updateUser,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/").post(registerUser).get(verifyToken, getUserProfile);
router.route("/edit").put(verifyToken, updateUser);

module.exports = router;
