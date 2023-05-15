import { MdLogout } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import {
  GetToken,
  GetProfile,
  GetModal,
  GetGroupChat,
} from "../Context/userProvider";
import { logoutUrl, axios } from "../api/fetchLinks";
import { useNavigate } from "react-router-dom";

function GroupList({ handleLogoutModal, handleCreateServerModal }) {
  const Navigate = useNavigate();
  const [groupChatList, setGroupChatList] = GetGroupChat();

  return (
    <div className="group-tab">
      <div className="group-tab-top">
        <div className="group-button active" id="personal">
          @<span className="group-desc">Dirrect Messages</span>
        </div>
        <div className="seperate-line"></div>
        {groupChatList &&
          groupChatList.map((groupChat) => {
            return (
              <div
                className="group-button"
                key={groupChat?._id ?? ""}
                id={groupChat?._id ?? ""}
              >
                {groupChat?.pic == "" ? (
                  "A"
                ) : (
                  <img className="server-pic" src={groupChat.pic}></img>
                )}
                <span className="group-desc">{groupChat?.chatName ?? ""}</span>
              </div>
            );
          })}

        {/* <div className="group-button" id="group-a">
          A<span className="group-desc">Group A</span>
        </div>
        <div className="group-button" id="group-b">
          B<span className="group-desc">Group B</span>
        </div> */}
      </div>
      <div className="group-tab-bot">
        <button
          className="group-button create"
          onClick={() => handleCreateServerModal()}
        >
          <AiOutlinePlus />
          <span className="group-desc">Create a Server</span>
        </button>
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
