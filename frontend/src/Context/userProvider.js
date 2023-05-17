import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchChatUrl,
  getProfileUrl,
  refreshUrl,
  axios,
} from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";

const tokenContext = createContext();
const profileContext = createContext();
const modalContext = createContext();
const groupChatContext = createContext();
let currToken;

export function GetToken() {
  return useContext(tokenContext);
}

export function GetProfile() {
  return useContext(profileContext);
}

export function GetModal() {
  return useContext(modalContext);
}

export function GetGroupChat() {
  return useContext(groupChatContext);
}
function UserProvider({ children }) {
  const location = useLocation();
  const Navigate = useNavigate();
  const [userProfile, setUserProfile] = useState();
  const [token, setToken] = useState();
  const [modal, setModal] = useState({
    modalLogout: false,
    modalPicEdit: false,
    modalServerCreation: false,
  });
  const [groupChatList, setGroupChatList] = useState();
  const currPath = location.pathname;

  const checkToken = async () => {
    if (!token) {
      const latestGroup = localStorage.getItem("latest-group");

      await axios.get(refreshUrl + "?checker=true").then((data) => {
        if (data.data.accessToken) {
          const state = { token: data.data.accessToken };
          currToken = data.data.accessToken;
          let navigateLocation =
            currPath ||
            (latestGroup ? "/channel/" + latestGroup : "/channel/@me");
          if (navigateLocation === "/") {
            navigateLocation = "/channel/@me";
          }
          Navigate(navigateLocation, { state });
        } else {
          let navigateLocation;
          if (location.state?.location) {
            navigateLocation = location.state?.location;
          } else {
            navigateLocation =
              currPath ||
              (latestGroup ? "/channel/" + latestGroup : "/channel/@me");
            if (navigateLocation === "/") {
              navigateLocation = "/channel/@me";
            }
          }
          const state = { location: navigateLocation };
          console.log(state);
          Navigate("/", { state });
        }
      });
    }
  };
  const fetchData = async () => {
    if (!currToken) {
      currToken = token || location.state?.token;
    }
    setToken(currToken);
    if (currPath.startsWith("/channel") && !userProfile) {
      const response = await secureAxios(currToken).get(getProfileUrl);
      if (response) {
        setUserProfile(response.data);
        setToken(response.token);
        currToken = response.token;
      }
      const chatData = await secureAxios(currToken).get(fetchChatUrl);
      if (chatData) {
        setToken(chatData.token);
        setGroupChatList(chatData.data.groupChats);
        currToken = response.token;
      }

      if (!chatData || !response) {
        setToken();
        setUserProfile();
        const state = { forbidden: true };
        Navigate("/", { state });
        return;
      }
    }
  };

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      await checkToken();
      fetchData();
    };
    checkTokenAndFetchData();
  }, [Navigate]);

  return (
    <tokenContext.Provider value={[token, setToken]}>
      <profileContext.Provider value={[userProfile, setUserProfile]}>
        <modalContext.Provider value={[modal, setModal]}>
          <groupChatContext.Provider value={[groupChatList, setGroupChatList]}>
            {children}
          </groupChatContext.Provider>
        </modalContext.Provider>
      </profileContext.Provider>
    </tokenContext.Provider>
  );
}

export default UserProvider;
