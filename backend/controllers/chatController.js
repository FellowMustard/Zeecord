const { randomizeString } = require("../middleware/randomizeString");
const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");

const createGroupChat = asyncHandler(async (req, res) => {
  const { chatName, pic } = req.body;
  let link = "";

  do {
    link = randomizeString(8);
  } while (await Chat.findOne({ link }));

  const joinedDate = new Date();

  const groupChat = await Chat.create({
    chatName,
    link,
    pic,
    isGroupChat: true,
    users: [{ user: req.id, joinedDate }],
    groupAdmin: req.id,
  });

  const groupChatData = await Chat.findOne({ _id: groupChat._id }).populate(
    "users.user",
    "-password"
  );

  if (groupChatData) {
    res.status(200).json({
      _id: groupChatData._id,
      chatName: groupChatData.chatName,
      link: groupChatData.link,
      pic: groupChatData.pic,
      isGroupChat: groupChatData.isGroupChat,
      users: groupChatData.users,
    });
  } else {
    return res.status(400).json({ message: "Invalid Server Data!" });
  }
});

const fetchGroupDetail = asyncHandler(async (req, res) => {
  const { link } = req.params;
  const groupChat = await Chat.findOne({ link });

  if (groupChat) {
    const joined = groupChat.users.some(
      (users) => users.user.toString() === req.id
    );
    res.status(200).json({ groupChat, joined });
  } else {
    return res.status(400).json({ message: "Link Invalid!" });
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  const chatList = await Chat.find({
    users: { $elemMatch: { user: req.id } },
  })
    .select(["-latestMessage", "-groupAdmin"])
    .populate("users.user", "-password");
  if (chatList) {
    const groupChats = chatList.filter((chat) => chat.isGroupChat);
    const singleChats = chatList.filter((chat) => !chat.isGroupChat);
    res.status(200).json({ groupChats, singleChats });
  } else {
    return res.status(400).json({ message: "No Chat Data!" });
  }
});

const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatID } = req.body;

  const checkGroup = await Chat.findOne({ _id: chatID, isGroupChat: false });
  const checkUser = await Chat.findOne({
    _id: chatID,
    users: { $elemMatch: { user: req.id } },
  });

  if (checkGroup || checkUser) {
    return res.status(400).json({ message: "Invalid Server Data!" });
  }

  const joinedDate = new Date();

  const addUser = await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: { users: { user: req.id, joinedDate } },
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
  fetchGroupDetail,
  fetchChat,
  addToGroupChat,
};
