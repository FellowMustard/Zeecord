import { MdDiversity3, MdLogout } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import {
  GetToken,
  GetProfile,
  GetModal,
  GetGroupChat,
} from "../Context/userProvider";
import { logoutUrl, axios } from "../api/fetchLinks";
import { useNavigate, NavLink, useParams } from "react-router-dom";

function GroupList({ handleLogoutModal, handleCreateServerModal }) {
  const { channelName } = useParams();
  const Navigate = useNavigate();
  const [groupChatList, setGroupChatList] = GetGroupChat();

  const handleGroupChatClick = (groupLink) => {
    localStorage.setItem("latest-group", groupLink);
    Navigate("/channel/" + groupLink);
  };
  return (
    <div className="group-tab">
      <div className="group-tab-top">
        <div
          className="group-button active"
          id="personal"
          onClick={() => handleGroupChatClick("@me")}
        >
          @<span className="group-desc">Dirrect Messages</span>
        </div>
        <div className="seperate-line"></div>
        {groupChatList &&
          groupChatList.map((groupChat) => {
            return (
              <div
                onClick={() => handleGroupChatClick(groupChat.link)}
                className={`group-button server ${
                  groupChat.link == channelName ? "active" : ""
                }`}
                key={groupChat?.link ?? ""}
                id={groupChat?.link ?? ""}
              >
                {groupChat?.pic == "" ? (
                  getFirstLine(groupChat.chatName)
                ) : (
                  <img className="server-pic" src={groupChat.pic}></img>
                )}
                <span className="group-desc">{groupChat?.chatName ?? ""}</span>
              </div>
            );
          })}
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

const getFirstLine = (word) => {
  return word.charAt(0).toUpperCase();
};
