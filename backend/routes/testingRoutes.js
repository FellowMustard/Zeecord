const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/").get(verifyToken, (req, res) => {
  res.send("ohayo");
});
module.exports = router;
