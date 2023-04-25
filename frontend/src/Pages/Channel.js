import { useNavigate } from "react-router-dom";
import { GetToken, GetProfile, GetModal } from "../Context/userProvider";
import { testingUrl } from "../api/fetchLinks";
import secureAxios from "../api/secureLinks";
import GroupList from "../Components/groupList";
import Logout from "../Modals/logout";
import SubList from "../Components/subList";
import PicEdit from "../Modals/picEdit";

function Channel() {
  const [modal, setModal] = GetModal();
  const currModal = { ...modal };
  const Navigate = useNavigate();
  const [userProfile, setUserProfile] = GetProfile();
  const [token, setToken] = GetToken();

  const handleLogoutModal = () => {
    currModal.modalLogout = true;
    setModal(currModal);
  };

  const handleTest = async () => {
    const response = await secureAxios(token).get(testingUrl);
    if (!response) {
      setUserProfile();
      setToken();
      Navigate("/");
    } else {
      setToken(response.token);
    }
  };

  return (
    <div className="main-body">
      <Modal />
      <div className="top-title">Zeecord</div>
      <div className="content-area">
        <GroupList handleLogoutModal={handleLogoutModal} />
        <div className="right-content">
          <SubList />
        </div>
      </div>
    </div>
  );
}

function Modal() {
  const [modal, setModal] = GetModal();
  const currModal = { ...modal };
  return (
    <div className="empty">
      {modal.modalLogout && (
        <Logout currModal={currModal} modalState={[modal, setModal]} />
      )}
      {modal.modalPicEdit && (
        <PicEdit currModal={currModal} modalState={[modal, setModal]} />
      )}
    </div>
  );
}

export default Channel;
