import { useNavigate } from "react-router-dom";
import { GetToken, GetProfile, GetModal } from "../Context/userProvider";
import GroupList from "../Components/groupList";
import Logout from "../Modals/logout";
import SubList from "../Components/subList";
import PicEdit from "../Modals/picEdit";
import { useEffect } from "react";
import { GetNewUser } from "../Function/newUser";
import ServerCreation from "../Modals/serverCreation";
import ChatSection from "../Components/chatSection";

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

  const handleCreateServerModal = () => {
    currModal.modalServerCreation = true;
    setModal(currModal);
  };

  useEffect(() => {
    const newUserState = JSON.parse(GetNewUser());
    currModal.modalPicEdit = newUserState;
    setModal(currModal);
  }, []);

  return (
    <div className="main-body">
      <Modal />
      <div className="top-title">Zeecord</div>
      <div className="content-area">
        <GroupList
          handleLogoutModal={handleLogoutModal}
          handleCreateServerModal={handleCreateServerModal}
        />
        <div className="right-content">
          <SubList />
          <ChatSection />
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
      {modal.modalServerCreation && (
        <ServerCreation currModal={currModal} modalState={[modal, setModal]} />
      )}
      {modal.modalPicEdit && (
        <PicEdit currModal={currModal} modalState={[modal, setModal]} />
      )}
    </div>
  );
}

export default Channel;
