const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { randomizeCode } = require("../middleware/randomizeCode");

const getUserProfile = asyncHandler(async (req, res) => {
  const id = "";
  const user = await User.findById(id).select("-password");
  if (!user) {
    return res.status(400).json({ message: "No User Found" });
  }
  return res.json(user);
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, dob } = req.body;

  if (!username || !email || !password || !dob) {
    return res.status(400).json({ message: "All Fields are Required!" });
  }

  const emailChecker = await User.findOne({ email });

  if (emailChecker) {
    return res
      .status(409)
      .json({ message: "Email Already Used! Please Use Another Email!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const code = randomizeCode();
  const userObject = { username, email, password: hashedPassword, code, dob };

  const user = await User.create(userObject);

  if (user) {
    return res.status(201).json({ message: `User ${username} Created!` });
  } else {
    return res.status(400).json({ message: "Invalid User Data!" });
  }
});

const updateUser = asyncHandler(async (req, res) => {});

module.exports = { getUserProfile, registerUser };
