import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetGroupChat,
  GetToken,
  GetLogout,
  GetProfile,
  GetSocket,
} from "../Context/userProvider";
import secureAxios from "../api/secureLinks";
import { axios, messageUrl } from "../api/fetchLinks";
import socket from "../api/socket";
import { v4 as uuidv4 } from "uuid";
import { replaceHttp } from "../Function/replaceHttp";

function ChatSection() {
  const Navigate = useNavigate();
  const [socketConnection, setSocketConnection] = GetSocket();
  const [token, setToken] = GetToken();
  const [userProfile, setUserProfile] = GetProfile();
  const [, setLogout] = GetLogout();
  const [groupChatList] = GetGroupChat();
  const [messageList, setMessageList] = useState([]);
  const [previewMessage, setPreviewMessage] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [typingData, setTypingData] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentID, setCurrentID] = useState();
  const { channelName } = useParams();
  const scrollContentRef = useRef(null);
  const previousChannelName = useRef(channelName);

  const scrollToBottom = () => {
    scrollContentRef.current?.scrollIntoView({ behavior: "auto" });
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
    socket.on("typing state", handlePeopleTyping);
    return () => {
      socket.off("message recieved", handleMessageRecieved);
      socket.off("typing state", handlePeopleTyping);
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
          if (error.name === "CanceledError" || error.name === "AxiosError") {
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
    if (channelName !== "@me" && socketConnection) {
      setTypingData([]);
      fetchData();
    }
    return () => {
      abortController.abort();
      if (
        previousChannelName.current !== "@me" &&
        previousChannelName.current !== channelName
      ) {
        socket.emit("leave chat", channelName);
      }
    };
  }, [channelName, socketConnection]);

  const handleMessageRecieved = useCallback(
    (message) => {
      if (!channelName) {
      } else {
        setMessageList((prevList) => [...prevList, message]);
      }
    },
    [channelName]
  );

  const handlePeopleTyping = useCallback(
    (type) => {
      if (!type) {
        setTypingData([]);
        return;
      }
      const typeData = type.filter(
        (data) =>
          data.username !== userProfile.username && data.id !== userProfile._id
      );
      console.log(typeData);
      setTypingData(typeData);
    },
    [channelName]
  );

  const handleTyping = (e) => {
    setMessageContent(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        username: userProfile.username,
        id: userProfile._id,
        room: channelName,
      });
    }
  };

  useEffect(() => {
    if (!isTyping) return;
    const stopTyping = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop typing", {
        username: userProfile.username,
        id: userProfile._id,
        room: channelName,
      });
    }, 3000);

    return () => clearTimeout(stopTyping);
  }, [messageContent]);

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
          {messageList.map((message, index) => {
            const previousMesage = messageList[index - 1];

            const sameAsPrevious =
              previousMesage &&
              message.sender._id === previousMesage.sender._id &&
              dateConverter(message.createdAt) ===
                dateConverter(previousMesage.createdAt);
            return (
              <div
                key={message._id}
                className={`chat-box ${!sameAsPrevious ? "up-margin" : ""}`}
              >
                {sameAsPrevious ? (
                  <div className="chat-blank"></div>
                ) : (
                  <img
                    className="chat-pic"
                    src={replaceHttp(message.sender.pic)}
                  />
                )}

                <section className="chat-detail">
                  {sameAsPrevious ? (
                    <></>
                  ) : (
                    <div className="chat-detail-top">
                      <span className="chat-sender">
                        {message.sender.username}
                      </span>
                      <span className="chat-time">
                        {dateConverter(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className="chat-content">{message.content}</div>
                </section>
              </div>
            );
          })}
          {previewMessage.map((message, index) => {
            let previousMesage;
            let anonID;
            let time;

            if (messageList.length === 0) {
              previousMesage = false;
            } else {
              if (index === 0) {
                previousMesage = messageList[messageList.length - 1];
                anonID = previousMesage.sender._id;
                time = previousMesage.createdAt;
              } else {
                previousMesage = previewMessage[index - 1];
                anonID = userProfile._id;
                time = Date.now();
              }
            }

            const sameAsPrevious =
              previousMesage &&
              userProfile._id === anonID &&
              dateConverter(Date.now()) === dateConverter(time);

            return (
              <div
                key={message.unique}
                className={`chat-box preview ${
                  !sameAsPrevious ? "up-margin" : ""
                }`}
              >
                {sameAsPrevious ? (
                  <div className="chat-blank"></div>
                ) : (
                  <img
                    className="chat-pic"
                    src={replaceHttp(userProfile.pic)}
                  />
                )}

                <section className="chat-detail">
                  {sameAsPrevious ? (
                    <></>
                  ) : (
                    <div className="chat-detail-top">
                      <span className="chat-sender">
                        {userProfile.username}
                      </span>
                      <span className="chat-time">
                        {dateConverter(Date.now())}
                      </span>
                    </div>
                  )}

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
            onChange={(e) => handleTyping(e)}
            value={messageContent}
          ></input>

          <div className="typing-status">
            <span className="name">
              {typingData ? getTyping(typingData) : ""}
            </span>
            {typingData.length !== 0 && (
              <span>
                {typingData.length > 1 ? " are Typing..." : " is Typing..."}
              </span>
            )}
          </div>
        </form>
      </main>
    )
  );
}

function getTyping(data) {
  if (data.length === 0) return;
  if (data.length >= 3) return "Several People are Typing...";
  const usernames = data.map((item) => item.username).join(",");
  return usernames;
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
