import { useEffect, useState } from "react";
import { GetLogout, GetToken } from "../Context/userProvider";
import { addToGroupUrl, fetchGroupDetailUrl } from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";
import { useNavigate, useParams } from "react-router-dom";
import { replaceHttp } from "../Function/replaceHttp";
import socket from "../api/socket";

function Join() {
  const Navigate = useNavigate();
  const { groupLink } = useParams();

  const [, setLogout] = GetLogout();
  const [token, setToken] = GetToken();

  const [groupData, setGroupData] = useState();

  const [, setNotFound] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleNavigation = (link) => {
    Navigate("/channel/" + link);
  };
  const handleJoinGroup = async (link) => {
    await secureAxios(token)
      .put(addToGroupUrl, { chatID: groupData._id })
      .then((data) => {
        socket.emit("added group", { data: data.data, link });
        Navigate("/channel/" + link);
      })
      .catch((error) => {
        setLogout(true);
        const state = { forbidden: true };
        Navigate("/", { state });
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await secureAxios(token)
        .get(fetchGroupDetailUrl + "/" + groupLink)
        .then((updateResponse) => {
          setToken(updateResponse.token);
          setGroupData(updateResponse.data.groupChat);
          setJoined(updateResponse.data.joined);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setLogout(true);
            const state = { forbidden: true };
            Navigate("/", { state });
          }
          if (error.response.status === 400) {
            setNotFound(true);
          }
        });
    };

    if (token) {
      fetchData();
    }
  }, [token]);
  return (
    <main className="main-body center">
      {groupData && (
        <div className="join-card">
          <span className="join-title">
            {joined
              ? "You Already Joined This Server"
              : "You are Invited to Join This Server"}
          </span>
          <div className="join-server-details">
            <img className="server-pic" src={replaceHttp(groupData.pic)}></img>
            <div className="server-detail">
              <span className="server-name">{groupData.chatName}</span>
              <span className="member-total">
                • {groupData.users.length} Members
              </span>
              {joined ? (
                <button
                  onClick={() => handleNavigation(groupData.link)}
                  className="server-button"
                >
                  Go to Server
                </button>
              ) : (
                <button
                  onClick={() => handleJoinGroup(groupData.link)}
                  className="server-button"
                >
                  Join this Server
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Join;
