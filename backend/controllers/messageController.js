const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const getMessage = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatID }).populate(
    "sender",
    "username pic"
  );
  if (messages) {
    res.status(200).json(messages);
  } else {
    return res.status(400).json({ message: "No Chat Data!" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatID, unique, id } = req.body;

  if (!content || !chatID) {
    return res.status(400).json({ message: "Message Invalid!" });
  }
  const checkUser = await Chat.findOne({
    _id: chatID,
    users: { $elemMatch: { user: id } },
  });

  if (!checkUser) {
    return res.status(400).json({ message: "User Invalid!" });
  }

  const createMessage = await Message.create({
    sender: id,
    content,
    chat: chatID,
    unique,
  });

  if (!createMessage) {
    return res.status(400).json({ message: "Message Invalid!" });
  }
  let messageData = await createMessage.populate([
    { path: "sender", select: "username pic" },
    { path: "chat" },
  ]);
  messageData = await User.populate(messageData, {
    path: "chat.users.user",
    select: "name pic",
  });
  return res.status(200).json(messageData);
});

module.exports = { sendMessage, getMessage };
