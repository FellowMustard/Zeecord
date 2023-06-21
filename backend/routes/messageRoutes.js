const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { sendMessage, getMessage } = require("../controllers/messageController");

router.route("/:chatID").get(verifyToken, getMessage);
router.route("/").post(verifyToken, sendMessage);

module.exports = router;
