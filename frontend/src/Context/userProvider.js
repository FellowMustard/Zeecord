import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChatUrl, getProfileUrl } from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";

const tokenContext = createContext();
const profileContext = createContext();
const modalContext = createContext();
const groupChatContext = createContext();

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
  const Navigate = useNavigate();
  const [userProfile, setUserProfile] = useState();
  const [token, setToken] = useState();
  const [modal, setModal] = useState({
    modalAuthLoading: false,
    modalLogout: false,
    modalPicEdit: false,
    modalServerCreation: false,
  });
  const [groupChatList, setGroupChatList] = useState();

  const fetchData = async () => {
    if (!token) {
      Navigate("/");
    } else {
      if (!userProfile) {
        const response = await secureAxios(token).get(getProfileUrl);
        if (response) {
          setUserProfile(response.data);
          setToken(response.token);
        } else {
          setToken();
          setUserProfile();
          const state = { forbidden: true };
          Navigate("/", { state });
          return;
        }
        const chatData = await secureAxios(token).get(fetchChatUrl);
        if (chatData) {
          setGroupChatList(chatData.data.groupChats);
        }
      }
      Navigate("/channel");
    }
  };

  useEffect(() => {
    fetchData();
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
