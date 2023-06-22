import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetGroupChat,
  GetToken,
  GetLogout,
  GetProfile,
} from "../Context/userProvider";
import secureAxios from "../api/secureLinks";
import { axios, messageUrl } from "../api/fetchLinks";
import socket from "../api/socket";
import { v4 as uuidv4 } from "uuid";

function ChatSection() {
  const Navigate = useNavigate();
  const [token, setToken] = GetToken();
  const [userProfile, setUserProfile] = GetProfile();
  const [, setLogout] = GetLogout();
  const [groupChatList] = GetGroupChat();
  const [messageList, setMessageList] = useState([]);
  const [previewMessage, setPreviewMessage] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [currentID, setCurrentID] = useState();
  const { channelName } = useParams();
  const scrollContentRef = useRef(null);

  const scrollToBottom = () => {
    scrollContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messageList) {
      scrollToBottom();
    }
  }, [messageList]);

  useEffect(() => {
    if (isProcessingMessage || previewMessage.length === 0) {
      return;
    }

    const processingMessage = async () => {
      setIsProcessingMessage(true);
      scrollToBottom();
      const currPreview = previewMessage[0];
      await axios
        .post(messageUrl, {
          content: currPreview.content,
          chatID: currentID,
          unique: currPreview.unique,
          id: userProfile._id,
        })
        .then(async (data) => {
          setMessageList((prevList) => [...prevList, data.data]);
          socket.emit("new message", data.data);
          setPreviewMessage((prevPreview) => prevPreview.slice(1));
        })
        .catch((error) => {
          console.log(error);
          setPreviewMessage((prevPreview) => prevPreview.slice(1));
        })
        .finally(() => {
          setIsProcessingMessage(false);
        });
    };
    processingMessage();
  }, [previewMessage, isProcessingMessage]);

  useEffect(() => {
    socket.on("message recieved", handleMessageRecieved);
    return () => {
      socket.off("message recieved", handleMessageRecieved);
    };
  }, [socket]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      if (!groupChatList || channelName == "@me") return;
      const currentChannel = groupChatList.find(
        (chat) => chat.link === channelName
      );
      setMessageList([]);
      setCurrentID(currentChannel._id);
      await secureAxios(token)
        .get(messageUrl + "/" + currentChannel._id, { signal })
        .then((updateResponse) => {
          setMessageList(updateResponse.data);
          socket.emit("join chat", channelName);
        })
        .catch((error) => {
          if (error.name === "CanceledError") {
            return;
          }
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

    setMessageList([]);
    if (channelName !== "@me") {
      fetchData();
    }
    return () => {
      abortController.abort();
      socket.emit("leave chat", channelName);
    };
  }, [channelName, groupChatList]);

  const handleMessageRecieved = useCallback(
    (message) => {
      if (!channelName || channelName !== message.chat.link) {
      } else {
        setMessageList((prevList) => [...prevList, message]);
      }
    },
    [channelName]
  );

  const sendMessage = async (event) => {
    event.preventDefault();
    if (messageContent !== "") {
      const message = messageContent;
      const sendMessage = {
        content: message,
        unique: uuidv4(),
      };
      setMessageContent("");
      setPreviewMessage((prevPreview) => [...prevPreview, sendMessage]);
    }
  };

  return (
    channelName !== "@me" && (
      <main className="chat-section">
        <div className="chat-group">
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
          {previewMessage.map((message) => {
            return (
              <div key={message.unique} className="chat-box preview">
                <img className="chat-pic" src={userProfile.pic} />
                <section className="chat-detail">
                  <div className="chat-detail-top">
                    <span className="chat-sender">{userProfile.username}</span>
                    <span className="chat-time">
                      {dateConverter(Date.now())}
                    </span>
                  </div>
                  <div className="chat-content">{message.content}</div>
                </section>
              </div>
            );
          })}
          <div ref={scrollContentRef}></div>
        </div>
        <form className="typing-area" onSubmit={(e) => sendMessage(e)}>
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
