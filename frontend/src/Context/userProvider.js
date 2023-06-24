import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchChatUrl,
  getProfileUrl,
  refreshUrl,
  axios,
} from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";
import socket from "../api/socket";

const tokenContext = createContext();
const profileContext = createContext();
const modalContext = createContext();
const groupChatContext = createContext();
const logoutContext = createContext();
const socketContext = createContext();

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

export function GetLogout() {
  return useContext(logoutContext);
}

export function GetSocket() {
  return useContext(socketContext);
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
  const [logout, setLogout] = useState(false);
  const [groupChatList, setGroupChatList] = useState();
  const [socketConnection, setSocketConnection] = useState(false);
  const currPath = location.pathname;

  const navigationChecker = (current, latest) => {
    let link =
      current !== "/"
        ? current
        : latest
        ? "/channel/" + latest
        : "/channel/@me";
    return link;
  };

  const checkToken = async () => {
    if (!token) {
      const latestGroup = localStorage.getItem("latest-group");
      await axios
        .get(refreshUrl + "?checker=true")
        .then((data) => {
          let navigateLocation;
          if (data.data.accessToken) {
            const state = { token: data.data.accessToken };
            currToken = data.data.accessToken;
            navigateLocation = navigationChecker(currPath, latestGroup);
            Navigate(navigateLocation, { state });
            return;
          }

          if (location.state?.location) {
            navigateLocation = location.state?.location;
          } else {
            navigateLocation = navigationChecker(currPath, latestGroup);
          }
          const state = { location: navigateLocation };
          Navigate("/", { state });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setLogout(true);
            const state = { forbidden: true };
            Navigate("/", { state });
            return;
          }
        });
    }
  };
  const fetchData = async () => {
    if (currToken && !token) {
      setToken(currToken);
    } else if (!currToken && location.state?.token) {
      currToken = location.state?.token;
      setToken(currToken);
    } else {
      currToken = token;
    }

    if (currPath.startsWith("/channel") && !userProfile) {
      const response = await secureAxios(currToken).get(getProfileUrl);
      if (response) {
        setUserProfile(response.data);
        setToken(response.token);
        currToken = response.token;
      }
      setLogout(false);
      if (!response) {
        setLogout(true);
        const state = { forbidden: true };
        Navigate("/", { state });
        return;
      }
    }

    if (currPath.startsWith("/channel") && !groupChatList) {
      const chatData = await secureAxios(currToken).get(fetchChatUrl);
      if (chatData) {
        setToken(chatData.token);
        setGroupChatList(chatData.data.groupChats);
        currToken = chatData.token;
        setLogout(false);
        if (!chatData) {
          setLogout(true);
          const state = { forbidden: true };
          Navigate("/", { state });
          return;
        }
      }
    }
  };
  const checkTokenAndFetchData = useCallback(async () => {
    await checkToken();
    fetchData();
  }, [Navigate]);

  useEffect(() => {
    checkTokenAndFetchData();
  }, [Navigate]);

  useEffect(() => {
    const clearData = async () => {
      await new Promise((resolve) => {
        localStorage.removeItem("latest-group");
        setToken();
        setGroupChatList();
        setUserProfile();
        currToken = "";
        console.log(location.state?.token, "sus");
        resolve();
      });
    };
    if (logout) {
      clearData();
    }
  }, [logout]);

  const socketChecking = useCallback(() => {
    if (userProfile && !socketConnection) {
      socket.emit("setup", userProfile);
      socket.on("connected", () => setSocketConnection(true));

      return () => {
        socket.close();
        setSocketConnection(false);
      };
    }
  }, [userProfile]);

  useEffect(() => {
    socketChecking();
  }, [userProfile]);

  return (
    <logoutContext.Provider value={[logout, setLogout]}>
      <tokenContext.Provider value={[token, setToken]}>
        <profileContext.Provider value={[userProfile, setUserProfile]}>
          <socketContext.Provider
            value={[socketConnection, setSocketConnection]}
          >
            <modalContext.Provider value={[modal, setModal]}>
              <groupChatContext.Provider
                value={[groupChatList, setGroupChatList]}
              >
                {children}
              </groupChatContext.Provider>
            </modalContext.Provider>
          </socketContext.Provider>
        </profileContext.Provider>
      </tokenContext.Provider>
    </logoutContext.Provider>
  );
}

export default UserProvider;
