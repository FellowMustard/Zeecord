import { useNavigate } from "react-router-dom";
import { GetToken, GetProfile } from "../Context/userProvider";
import { logoutUrl, axios } from "../api/fetchLinks";

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

  return (
    <div>
      Hello {userProfile?.username ?? "user"}#{userProfile?.code ?? "0000"}
      <button onClick={() => handleLogout()}>log out here</button>
    </div>
  );
}

export default Channel;
