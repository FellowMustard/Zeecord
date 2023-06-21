import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetGroupChat, GetToken, GetLogout } from "../Context/userProvider";
import secureAxios from "../api/secureLinks";
import { messageUrl, fetchGroupDetailUrl } from "../api/fetchLinks";

function ChatSection() {
  const Navigate = useNavigate();
  const [token, setToken] = GetToken();
  const [logout, setLogout] = GetLogout();
  const [groupChatList, setGroupChatList] = GetGroupChat();
  const [messageList, setMessageList] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [currentID, setCurrentID] = useState();
  const { channelName } = useParams();

  useEffect(() => {
    if (channelName !== "@me") {
      fetchData();
    }
  }, [channelName, groupChatList]);

  const sendMessage = async (event) => {
    if (event.key == "Enter" && messageContent) {
      event.preventDefault();
      console.log("aa");
      await secureAxios(token)
        .post(messageUrl, {
          content: messageContent,
          chatID: currentID,
        })
        .then((data) => {
          setMessageList([...messageList, data.data]);
          setMessageContent("");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setLogout(true);
            const state = { forbidden: true };
            Navigate("/", { state });
          }
        });
    }
  };

  const fetchData = async () => {
    if (!groupChatList || channelName == "@me") return;
    const currentChannel = groupChatList.find(
      (chat) => chat.link === channelName
    );
    setCurrentID(currentChannel._id);
    await secureAxios(token)
      .get(messageUrl + "/" + currentChannel._id)
      .then((updateResponse) => {
        setMessageList(updateResponse.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setLogout(true);
          const state = { forbidden: true };
          Navigate("/", { state });
        }
        if (error.response.status === 403) {
          Navigate("/channel/@me");
        }
      });
  };

  return (
    channelName !== "@me" && (
      <main className="chat-section">
        <div className="chat-area">
          {messageList.map((message) => {
            return (
              <div key={message._id} className="chat-box">
                <img className="chat-pic" src={message.sender.pic} />
                <section className="chat-detail">
                  <div className="chat-detail-top">
                    <span className="chat-sender">
                      {message.sender.username}
                    </span>
                    <span className="chat-time">
                      {dateConverter(message.createdAt)}
                    </span>
                  </div>
                  <div className="chat-content">{message.content}</div>
                </section>
              </div>
            );
          })}
        </div>
        <form className="typing-area" onKeyDown={(e) => sendMessage(e)}>
          <input
            className="typing-input"
            placeholder="Send Message"
            onChange={(e) => setMessageContent(e.target.value)}
            value={messageContent}
          ></input>
        </form>
      </main>
    )
  );
}

function dateConverter(dateString) {
  let dateOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const todayDate = new Date();
  const yesterday = new Date();
  yesterday.setDate(todayDate.getDate() - 1);
  const targetDate = new Date(dateString);

  if (
    targetDate.getDate() === todayDate.getDate() &&
    targetDate.getMonth() === todayDate.getMonth() &&
    targetDate.getFullYear() === todayDate.getFullYear()
  ) {
    return `Today at ${targetDate
      .toLocaleString("en-US", dateOptions)
      .toUpperCase()}`;
  } else if (
    targetDate.getDate() === yesterday.getDate() &&
    targetDate.getMonth() === yesterday.getMonth() &&
    targetDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${targetDate
      .toLocaleString("en-US", dateOptions)
      .toUpperCase()}`;
  } else {
    dateOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return targetDate.toLocaleString("en-US", dateOptions).toUpperCase();
  }
}
export default ChatSection;
