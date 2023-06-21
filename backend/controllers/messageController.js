const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const getMessage = asyncHandler(async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatID }).populate(
    "sender",
    "username pic"
  );
  console.log(messages);
  if (messages) {
    res.status(200).json(messages);
  } else {
    return res.status(400).json({ message: "No Chat Data!" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatID } = req.body;

  if (!content || !chatID) {
    return res.status(400).json({ message: "Message Invalid!" });
  }
  const checkUser = await Chat.findOne({
    _id: chatID,
    users: { $elemMatch: { user: req.id } },
  });

  if (!checkUser) {
    return res.status(400).json({ message: "User Invalid!" });
  }

  const newMessage = { sender: req.id, content, chat: chatID };
  const createMessage = await Message.create(newMessage);

  if (createMessage) {
    let messageData = await createMessage.populate("sender", "username pic");
    messageData = await messageData.populate("chat");
    messageData = await User.populate(messageData, {
      path: "chat.users.user",
      select: "name pic",
    });

    await Chat.findByIdAndUpdate(req.body.chatID, {
      latestMessage: messageData,
    });

    return res.status(200).json(messageData);
  } else {
    return res.status(400).json({ message: "Message Invalid!" });
  }
});

module.exports = { sendMessage, getMessage };
