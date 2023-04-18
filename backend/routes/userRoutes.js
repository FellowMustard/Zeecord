const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/").post(registerUser).get(verifyToken, getUserProfile);

module.exports = router;
