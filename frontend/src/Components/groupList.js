import { MdLogout } from "react-icons/md";
import { GetToken, GetProfile, GetModal } from "../Context/userProvider";
import { logoutUrl, axios } from "../api/fetchLinks";
import { useNavigate } from "react-router-dom";

function GroupList({ handleLogoutModal }) {
  const Navigate = useNavigate();

  return (
    <div className="group-tab">
      <div className="group-tab-top">
        <div className="group-button active" id="personal">
          @<span className="group-desc">Dirrect Messages</span>
        </div>
        <div className="seperate-line"></div>
        <div className="group-button" id="group-a">
          A<span className="group-desc">Group A</span>
        </div>
        <div className="group-button" id="group-b">
          B<span className="group-desc">Group B</span>
        </div>
      </div>
      <div className="group-tab-bot">
        <button
          className="group-button logout"
          onClick={() => handleLogoutModal()}
        >
          <MdLogout />
          <span className="group-desc">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default GroupList;
