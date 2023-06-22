import io from "socket.io-client";

const baseUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "https://zeecord-api.vercel.app/"
    : "http://localhost:5000/";

const socket = io(baseUrl);
export default socket;
