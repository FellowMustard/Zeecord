const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    link: { type: String },
    pic: {
      type: String,
    },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedDate: { type: Date, default: Date.now },
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
