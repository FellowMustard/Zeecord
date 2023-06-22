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
const messageRoutes = require("./routes/messageRoutes");

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
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://zeecord.vercel.app"
    : "http://localhost:3000";

mongoose.connection.once("open", () => {
  console.log(`Database is Connected`.cyan.bold);
  const server = app.listen(
    PORT,
    console.log(`PORT ${PORT} is working`.green.bold)
  );
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: baseUrl,
    },
  });

  io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("leave chat", (room) => {
      socket.leave(room);
      console.log("User Leave Room: " + room);
    });

    socket.on("new message", (newMessage) => {
      console.time("send");
      socket.to(newMessage.chat.link).emit("message recieved", newMessage);
      console.timeEnd("send");
    });
  });
});

mongoose.connection.once("error", (err) => {
  console.log(err.red.bold);
});
