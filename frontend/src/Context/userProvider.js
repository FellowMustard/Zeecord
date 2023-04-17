import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios, getProfileUrl } from "../api/fetchLinks";
const tokenContext = createContext();
const profileContext = createContext();

export function GetToken() {
  return useContext(tokenContext);
}

export function GetProfile() {
  return useContext(profileContext);
}

function UserProvider({ children }) {
  const Navigate = useNavigate();
  const [userProfile, setUserProfile] = useState();
  const [token, setToken] = useState();

  const fetchData = async () => {
    if (!token) {
      Navigate("/");
    } else {
      if (!userProfile) {
        const { data } = await axios.get(getProfileUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(data);
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
        {children}
      </profileContext.Provider>
    </tokenContext.Provider>
  );
}

export default UserProvider;
