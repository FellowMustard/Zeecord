const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

const app = express();

app.use(express.json());
app.use("/api/testing", (req, res) => {
  res.status(200).json({ value: "important123" });
});
app.use("/api/testing123", (req, res) => {
  res.status(200).json({ value: "very important" });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client", "public")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "public", "index.html"));
  });
}
app.listen(PORT, console.log(`PORT ${PORT} is working`.green.bold));
