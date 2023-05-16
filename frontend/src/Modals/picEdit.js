import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { BsImageFill } from "react-icons/bs";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Function/cropImage";
import { GetProfile, GetToken } from "../Context/userProvider";
import secureAxios from "../api/secureLinks";
import { editProfileUrl, uploadCloudinaryUrl } from "../api/fetchLinks";
import { SetNewUser } from "../Function/newUser";

function PicEdit({ currModal, modalState }) {
  const [modal, setModal] = modalState;
  const [uploadedImage, setUploadedImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleExitModal = () => {
    SetNewUser(false);
    currModal.modalPicEdit = false;
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
      setUploadedImage(base64);
    } else {
      alert("not image");
    }
  };

  return (
    <main className="modal-bg">
      {uploadedImage ? (
        <EditImage
          zoomState={[zoom, setZoom]}
          cropState={[crop, setCrop]}
          croppedPixelState={[croppedAreaPixels, setCroppedAreaPixels]}
          imageState={[uploadedImage, setUploadedImage]}
          onCropComplete={onCropComplete}
          handleExitModal={handleExitModal}
        />
      ) : (
        <UploadImage
          handleExitModal={handleExitModal}
          handleImageUpload={handleImageUpload}
        />
      )}
    </main>
  );
}

function UploadImage({ handleExitModal, handleImageUpload }) {
  return (
    <div className="modal-box vertical">
      <div className="modal-box-title between">
        <div>Select an Image</div>
        <button onClick={() => handleExitModal()}>
          <IoCloseOutline className="close-button" />
        </button>
      </div>
      <div className="modal-body">
        <input
          type="file"
          accept="image/*"
          className="add-image-input"
          id="add-image-input"
          onChange={(e) => {
            handleImageUpload(e);
          }}
        />
        <label htmlFor="add-image-input" className="add-image">
          <div className="logo">
            <BiImageAdd className="logo-svg" />
          </div>
          <span className="logo-text">Upload Image</span>
        </label>
      </div>
    </div>
  );
}

function EditImage({
  zoomState,
  cropState,
  croppedPixelState,
  imageState,
  onCropComplete,
  handleExitModal,
}) {
  const [uploadedImage, setUploadedImage] = imageState;
  const [crop, setCrop] = cropState;
  const [zoom, setZoom] = zoomState;
  const [croppedAreaPixels, setCroppedAreaPixels] = croppedPixelState;
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = GetProfile();
  const [token, setToken] = GetToken();
  const Navigate = useNavigate();

  const handleZoom = (e) => {
    setZoom(e.target.value);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(
        uploadedImage,
        croppedAreaPixels,
        0
      );
      updateImage(croppedImage);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const updateImage = async (file) => {
    let currentPic = userProfile.pic;

    if (currentPic) {
      currentPic = extractPublicId(currentPic);
      currentPic = `${process.env.REACT_APP_UPLOAD_FOLDER}/${currentPic}`;
    }

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    uploadData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
    uploadData.append("folder", process.env.REACT_APP_UPLOAD_FOLDER);

    const response = await fetch(uploadCloudinaryUrl, {
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

    await secureAxios(token)
      .put(editProfileUrl, {
        pic: response.toString(),
        currpic: currentPic,
      })
      .then((updateResponse) => {
        setToken(updateResponse.token);
        setUserProfile({
          ...userProfile,
          pic: updateResponse.data.pic,
          username: updateResponse.data.username,
        });
        setLoading(false);
        handleExitModal();
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setUserProfile();
          setLoading(false);
          setToken();
          const state = { forbidden: true };
          Navigate("/", { state });
        }
      });
  };

  const handleCancelButton = () => {
    setUploadedImage(null);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <>
      <div className="modal-box big vertical no-bot">
        <div className="modal-box-title between">
          <div>Edit Image</div>
        </div>
        <div className="cropper-zone">
          {loading ? (
            <AiOutlineLoading3Quarters className="loading-logo" />
          ) : (
            <Cropper
              image={uploadedImage}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
              cropShape="round"
              showGrid={false}
            />
          )}
        </div>
        <div className="zoom-container">
          <BsImageFill className="zoom small" />
          <input
            disabled={loading}
            className="zoom-slider"
            type="range"
            min={1}
            max={3}
            value={zoom}
            step={0.1}
            onChange={(e) => handleZoom(e)}
          />
          <BsImageFill className="zoom big" />
        </div>
      </div>
      <div className="zoom-button-container">
        <button disabled={loading} className="zoom-button">
          Skip
        </button>
        <div className="right-container">
          <button
            disabled={loading}
            onClick={(e) => handleCancelButton()}
            className="zoom-button"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className={`zoom-button blue ${loading ? "load" : ""}`}
            onClick={() => showCroppedImage()}
          >
            {loading ? (
              <div className="load-container">
                <div />
                <div />
                <div />
              </div>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default PicEdit;

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

function extractPublicId(url) {
  if (!url) {
    return null;
  }
  const startIndex = url.lastIndexOf("/") + 1;
  const endIndex = url.lastIndexOf(".");
  return url.substring(startIndex, endIndex);
}
