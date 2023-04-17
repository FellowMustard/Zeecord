const jwt = require("jsonwebtoken");
const createAccessToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
  return token;
};

const createRefreshToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "2d",
  });
  return token;
};

module.exports = { createAccessToken, createRefreshToken };
