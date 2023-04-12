const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");
const cors = require("cors");
const corsConfig = require("./config/corsConfig");

const app = express();
dotenv.config();
app.use(cors(corsConfig));

app.use(express.json());
app.use("/api/testing", (req, res) => {
  console.log(req.headers.origin);
  res.status(200).json({ value: "important123" });
});
app.use("/api/testing123", (req, res) => {
  res.status(200).json({ value: "very important" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`PORT ${PORT} is working`.green.bold));
