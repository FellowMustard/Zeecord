import { useNavigate } from "react-router-dom";
import { GetToken, GetProfile } from "../Context/userProvider";
import { logoutUrl, axios, refreshUrl, testingUrl } from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";

function Channel() {
  const Navigate = useNavigate();
  const [userProfile, setUserProfile] = GetProfile();
  const [token, setToken] = GetToken();

  const handleLogout = async () => {
    const { data } = await axios.post(logoutUrl);
    if (data) {
      setUserProfile();
      setToken();
      Navigate("/");
    }
  };
  const handleTest = async () => {
    const response = await secureAxios(token).get(testingUrl);
    if (!response) {
      setUserProfile();
      setToken();
      Navigate("/");
    } else {
      setToken(response.token);
    }
  };

  return (
    <div>
      Hello {userProfile?.username ?? "user"}#{userProfile?.code ?? "0000"}
      <button onClick={() => handleLogout()}>log out here</button>
      <button onClick={() => handleTest()}>TESTING</button>
    </div>
  );
}

export default Channel;
