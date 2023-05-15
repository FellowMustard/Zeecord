const { randomizeString } = require("../middleware/randomizeString");
const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");

const createGroupChat = asyncHandler(async (req, res) => {
  const { chatName, pic } = req.body;
  let link = "";

  do {
    link = randomizeString(8);
  } while (await Chat.findOne({ link }));

  const groupChat = await Chat.create({
    chatName,
    link,
    pic,
    isGroupChat: true,
    users: [req.id],
    groupAdmin: req.id,
  });

  if (groupChat) {
    res.json({
      _id: groupChat._id,
      chatName: groupChat.chatName,
      link: groupChat.link,
      pic: groupChat.pic,
      isGroupChat: groupChat.isGroupChat,
    });
  } else {
    return res.status(400).json({ message: "Invalid Server Data!" });
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  const chatList = await Chat.find({
    users: { $elemMatch: { $eq: req.id } },
  }).select(["-users", "-latestMessage", "-groupAdmin"]);
  if (chatList) {
    const groupChats = chatList.filter((chat) => chat.isGroupChat);
    const singleChats = chatList.filter((chat) => !chat.isGroupChat);
    res.json({ groupChats, singleChats });
  } else {
    return res.status(400).json({ message: "No Chat Data!" });
  }
});

module.exports = {
  createGroupChat,
  fetchChat,
};
