const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../controllers/userController");
const router = express.Router();

router.route("/").post(registerUser).get(getUserProfile);

module.exports = router;
