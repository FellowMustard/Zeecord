import { IoCloseOutline } from "react-icons/io5";
import { BsFillCameraFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createGroupChatUrl, uploadCloudinaryUrl } from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";
import { GetGroupChat, GetToken, GetProfile } from "../Context/userProvider";
import { useNavigate } from "react-router-dom";

function ServerCreation({ currModal, modalState }) {
  const Navigate = useNavigate();

  const SERVER_REGEX =
    /^(?=.{1,100}$)(?=.*[a-zA-Z0-9].*[a-zA-Z0-9])[^\s]{2,}.*$/;

  const [userProfile, setUserProfile] = GetProfile();
  const [token, setToken] = GetToken();
  const [groupChatList, setGroupChatList] = GetGroupChat();

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const [displayImage, setDisplayImage] = useState();
  const [uploadedImage, setUploadedImage] = useState();

  const [serverName, setServerName] = useState("");
  const [validServerName, setValidServerName] = useState(false);

  const [modal, setModal] = modalState;

  const handleExitModal = () => {
    currModal.modalServerCreation = false;
    setModal(currModal);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file["type"].split("/")[0] === "image") {
      if (file.size >= 4000000) {
        return alert("file must not reach 4mb");
      }
      let base64 = await convertToBase64(file);
      setDisplayImage(file);
      setUploadedImage(base64);
    } else {
      alert("not image");
    }
  };

  const removeImage = () => {
    setDisplayImage();
    setUploadedImage();
  };

  const createServer = async () => {
    setLoading(true);
    if (!validServerName) {
      setError(true);
      setLoading(false);
      return;
    }

    let response = null;
    if (uploadedImage) {
      const uploadData = new FormData();
      uploadData.append("file", uploadedImage);
      uploadData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      uploadData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
      uploadData.append("folder", process.env.REACT_APP_UPLOAD_FOLDER_SERVER);

      response = await fetch(uploadCloudinaryUrl, {
        method: "post",
        body: uploadData,
      })
        .then((res) => res.json())
        .then((data) => {
          return data.url;
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
    await secureAxios(token)
      .post(createGroupChatUrl, {
        chatName: serverName,
        pic: response ? response.toString() : "",
      })
      .then((newResponse) => {
        console.log("tes");
        console.log(newResponse);
        setToken(newResponse.token);
        const groupChat = groupChatList
          ? [
              ...groupChatList,
              {
                _id: newResponse.data._id,
                pic: newResponse.data.pic,
                chatName: newResponse.data.chatName,
                link: newResponse.data.link,
                isGroupChat: newResponse.data.isGroupChat,
                users: newResponse.data.users,
              },
            ]
          : [
              {
                _id: newResponse.data._id,
                pic: newResponse.data.pic,
                chatName: newResponse.data.chatName,
                link: newResponse.data.link,
                isGroupChat: newResponse.data.isGroupChat,
                users: newResponse.data.users,
              },
            ];
        console.log(groupChat);
        setGroupChatList(groupChat);
        setLoading(false);
        handleExitModal();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          setUserProfile();
          setLoading(false);
          setToken();
          const state = { forbidden: true };
          Navigate("/", { state });
        }
      });
  };

  useEffect(() => {
    const result = SERVER_REGEX.test(serverName);
    setValidServerName(result);
  }, [serverName]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <main className="modal-bg ">
      <div className="modal-box vertical no-bot">
        <div className="modal-box-title between">
          <div>Create a Server</div>
          <button onClick={() => handleExitModal()}>
            <IoCloseOutline className="close-button" />
          </button>
        </div>
        <div className="modal-body vertical">
          <span className="modal-desc">
            Give your server a name and an icon. You can always change it later.
          </span>
          <input
            type="file"
            accept="image/*"
            className="server-image-input"
            id="server-image-input"
            onChange={(e) => {
              handleImageUpload(e);
            }}
          />
          {displayImage ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(displayImage)}
                className="server-image"
              />
              {!loading && (
                <div className="remove-server-image-button">
                  <IoCloseOutline
                    onClick={() => {
                      removeImage();
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <label
              htmlFor="server-image-input"
              className="server-upload-button"
            >
              <BsFillCameraFill className="camera-sign" />
              <span>UPLOAD</span>
              <div className="plus-button">+</div>
            </label>
          )}
          <div className="server-name-container">
            <span>SERVER NAME</span>
            <input
              className="server-input"
              placeholder="Please Input Your Server Name"
              onChange={(e) => setServerName(e.target.value)}
            ></input>
          </div>
          <div className="server-error-box">
            {error ? (
              <motion.div
                animate={{ x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] }}
                transition={{ duration: 0.5 }}
                className="server-name-error"
              >
                <span>Server name must between 2-100 characters.</span>
              </motion.div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="create-server-button-container">
        <button
          onClick={() => {
            createServer();
          }}
          disabled={loading}
          className={`create-server-button ${loading ? "load" : ""}`}
        >
          {loading ? (
            <div className="load-container">
              <div />
              <div />
              <div />
            </div>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </main>
  );
}

export default ServerCreation;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(null);
    };
  });
}
