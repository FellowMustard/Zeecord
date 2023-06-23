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

var clientConnect = {};
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
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      clientConnect[socket.id] = {
        username: userData.username,
        code: userData.code,
        id: userData._id,
      };
      console.log(
        `${clientConnect[socket.id].username}#${
          clientConnect[socket.id].code
        }(${socket.id}) has connected`
      );
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log(
        `${clientConnect[socket.id].username}#${
          clientConnect[socket.id].code
        }(${socket.id}) has joined room : ${room}`
      );
    });
    socket.on("leave chat", (room) => {
      socket.leave(room);
      console.log(
        `${clientConnect[socket.id].username}#${
          clientConnect[socket.id].code
        }(${socket.id}) has left room : ${room}`
      );
    });

    socket.on("new message", (newMessage) => {
      console.time("send");
      socket.to(newMessage.chat.link).emit("message recieved", newMessage);
      console.timeEnd("send");
    });

    socket.on("disconnect", () => {
      if (!Object.keys(clientConnect).length === 0) {
        console.log(clientConnect);
        console.log(
          `${clientConnect[socket.id].username}#${
            clientConnect[socket.id].username
          }(${socket.id}) has disconnected`
        );
        delete clientConnect[socket.id];
      }
    });
  });
});

mongoose.connection.once("error", (err) => {
  console.log(err.red.bold);
});
