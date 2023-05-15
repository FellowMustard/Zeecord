const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../middleware/generateToken");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are Required!" });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(401).json({ message: "Wrong Email/Password!" });
  }

  const matchPassword = await bcrypt.compare(password, foundUser.password);
  if (!matchPassword) {
    return res.status(400).json({ message: "Wrong Email/Password!" });
  }

  const accessToken = createAccessToken(foundUser._id);

  const refreshToken = createRefreshToken(foundUser._id);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 2 * 24 * 60 * 60 * 1000, //2 days
  });

  res.json({ accessToken, username: foundUser.username });
});

const refresh = asyncHandler(async (req, res) => {
  const checker = req.query.checker;
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    if (checker) {
      return res.send();
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const foundUser = await User.findById(decoded.userId);
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        { userId: foundUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      return res.json({ accessToken });
    })
  );
});

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(204);
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Cookie Cleared!" });
};

module.exports = {
  loginUser,
  refresh,
  logout,
};
