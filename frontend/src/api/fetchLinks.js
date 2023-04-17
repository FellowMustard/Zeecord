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

export {
  testingUrl,
  registerUrl,
  loginUrl,
  axios,
  refreshUrl,
  getProfileUrl,
  logoutUrl,
};
