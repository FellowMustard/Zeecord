import axios from "axios";

axios.defaults.withCredentials = true;

const baseUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "https://zeecord-api.vercel.app/"
    : "http://localhost:5000/";

const testingUrl = baseUrl + "api/testing";
const registerUrl = baseUrl + "api/user";
const getProfileUrl = baseUrl + "api/user";
const loginUrl = baseUrl + "api/auth";
const refreshUrl = baseUrl + "api/auth/refresh";
const logoutUrl = baseUrl + "api/auth/logout";
const editProfileUrl = baseUrl + "api/user/edit";
const fetchChatUrl = baseUrl + "api/chat";
const createGroupChatUrl = baseUrl + "api/chat/group";
const fetchGroupDetailUrl = baseUrl + "api/chat/group";
const addToGroupUrl = baseUrl + "api/chat/groupadd";
const messageUrl = baseUrl + "api/message";
const uploadCloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`;

export {
  testingUrl,
  registerUrl,
  loginUrl,
  axios,
  refreshUrl,
  getProfileUrl,
  logoutUrl,
  editProfileUrl,
  fetchChatUrl,
  createGroupChatUrl,
  fetchGroupDetailUrl,
  addToGroupUrl,
  messageUrl,
  uploadCloudinaryUrl,
};
