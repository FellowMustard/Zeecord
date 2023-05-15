const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const cors = require("cors");
const corsConfig = require("./config/corsConfig");
const connectDB = require("./config/db");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const testingRoutes = require("./routes/testingRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/testing", testingRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", () => {
  console.log(`Database is Connected`.cyan.bold);
  app.listen(PORT, console.log(`PORT ${PORT} is working`.green.bold));
});

mongoose.connection.once("error", (err) => {
  console.log(err.red.bold);
});
