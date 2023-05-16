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
      users: groupChat.users,
    });
  } else {
    return res.status(400).json({ message: "Invalid Server Data!" });
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  const chatList = await Chat.find({
    users: { $elemMatch: { $eq: req.id } },
  })
    .select(["-latestMessage", "-groupAdmin"])
    .populate("users", "-password");
  if (chatList) {
    const groupChats = chatList.filter((chat) => chat.isGroupChat);
    const singleChats = chatList.filter((chat) => !chat.isGroupChat);
    res.json({ groupChats, singleChats });
  } else {
    return res.status(400).json({ message: "No Chat Data!" });
  }
});

const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatID } = req.body;
  const userID = req.id;

  const checkGroup = await Chat.findOne({ _id: chatID, isGroupChat: false });
  const checkUser = await Chat.findOne({
    _id: chatID,
    users: { $elemMatch: { $eq: userID } },
  });

  if (checkGroup || checkUser) {
    return res.status(400).json({ message: "Invalid Server Data!" });
  }
  const addUser = await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: { users: userID },
    },
    { new: true }
  ).populate("users", "-password");

  if (!addUser) {
    return res.status(400).json({ message: "Invalid Server Data!" });
  } else {
    return res.status(200).json(addUser);
  }
});

module.exports = {
  createGroupChat,
  fetchChat,
  addToGroupChat,
};
