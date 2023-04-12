const baseUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "https://zeecord-api.vercel.app/"
    : "http://localhost:5000/";

const testingUrl = baseUrl + "api/testing";
const registerUrl = baseUrl + "api/user";

export { testingUrl, registerUrl };
