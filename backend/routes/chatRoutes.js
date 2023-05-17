const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createGroupChat,
  fetchChat,
  addToGroupChat,
  fetchGroupDetail,
} = require("../controllers/chatController");

router.route("/").get(verifyToken, fetchChat);
router.route("/group/:link").get(verifyToken, fetchGroupDetail);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/groupadd").put(verifyToken, addToGroupChat);

module.exports = router;
