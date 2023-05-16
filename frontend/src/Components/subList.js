import { useEffect, useState } from "react";
import { GetGroupChat } from "../Context/userProvider";
import ProfileUser from "./profileUser";
import { useParams } from "react-router-dom";

function SubList() {
  const { channelName } = useParams();
  const [groupChatList, setGroupChatList] = GetGroupChat();
  const [currGroupDetails, setCurrGroupDetails] = useState();

  useEffect(() => {
    if (groupChatList) {
      console.log(groupChatList["2p5GQvxU"]);
      const currentGroup = groupChatList.find(
        (chat) => chat.link === channelName
      );
      setCurrGroupDetails(currentGroup);
    }
  }, [groupChatList, channelName]);
  return (
    <div className="sublist-container">
      <div className="sublist-head">
        {channelName == "@me" ? (
          <button className="find-conversation">
            Find or start a conversation
          </button>
        ) : (
          <span className="server-name">{currGroupDetails?.chatName}</span>
        )}
      </div>
      <div className="sublist-content">
        {channelName == "@me" ? (
          ""
        ) : (
          <>
            <span className="members-span">
              MEMBERS-{currGroupDetails?.users.length}
            </span>
            <div className="member-list">
              {currGroupDetails?.users.map((member) => {
                return (
                  <button
                    className="member-button"
                    id={member._id}
                    key={member._id}
                  >
                    <div className="friend-pic">
                      <img src={member.pic}></img>
                    </div>
                    <span>{member.username}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="sublist-footer">
        <ProfileUser />
      </div>
    </div>
  );
}

export default SubList;
