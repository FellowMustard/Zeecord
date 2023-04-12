const express = require("express");
const loginLimiter = require("../middleware/loginLimiter");
const { loginUser } = require("../controllers/authController");
const router = express.Router();

router.route("/").post(loginLimiter, loginUser);
// router.route("/refresh").get(refresh);
// router.route("/logout").post(logout);
module.exports = router;
