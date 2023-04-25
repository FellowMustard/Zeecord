const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { randomizeCode } = require("../middleware/randomizeCode");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middleware/generateToken");
const { deletePhoto } = require("../middleware/cloudinaryConfig");

const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.id;
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
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2 * 24 * 60 * 60 * 1000, //2 days
    });

    res.json({ accessToken, username: user.username });
  } else {
    return res.status(400).json({ message: "Invalid User Data!" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, pic, currpic } = req.body;
  const id = req.id;
  if (currpic) {
    deletePhoto(currpic);
  }
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      pic,
      username,
    },
    {
      new: true,
    }
  ).select("-password");

  if (updateUser) {
    return res.json({ username: updateUser.username, pic: updateUser.pic });
  } else {
    return res.status(400).json({ message: "Invalid User Data!" });
  }
});

module.exports = { getUserProfile, registerUser, updateUser };
