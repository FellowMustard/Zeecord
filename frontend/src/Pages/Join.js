import { useEffect, useState } from "react";
import { GetProfile, GetToken } from "../Context/userProvider";
import {
  createGroupChatUrl,
  fetchGroupDetailUrl,
  uploadCloudinaryUrl,
} from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";
import { useNavigate, useParams } from "react-router-dom";

function Join() {
  const Navigate = useNavigate();
  const { groupLink } = useParams();

  const [userProfile, setUserProfile] = GetProfile();
  const [token, setToken] = GetToken();

  const [groupData, setGroupData] = useState();

  const [notFound, setNotFound] = useState(false);
  const [joined, setJoined] = useState(false);

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
            setUserProfile();
            setToken();
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
            <img className="server-pic" src={groupData.pic}></img>
            <div className="server-detail">
              <span className="server-name">{groupData.chatName}</span>
              <span className="member-total">
                • {groupData.users.length} Members
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Join;
