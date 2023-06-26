import {
  GetProfile,
  GetModal,
  GetSocket,
  GetLoading,
} from "../Context/userProvider";
import GroupList from "../Components/groupList";
import Logout from "../Modals/logout";
import SubList from "../Components/subList";
import PicEdit from "../Modals/picEdit";
import { useEffect } from "react";
import { GetNewUser } from "../Function/newUser";
import ServerCreation from "../Modals/serverCreation";
import ChatSection from "../Components/chatSection";
import LoadingScreen from "../Components/loadingScreen";

function Channel() {
  const [socketConnection] = GetSocket();
  const [modal, setModal] = GetModal();
  const [loading] = GetLoading();
  const currModal = { ...modal };
  const [userProfile] = GetProfile();

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

  return !loading && userProfile && socketConnection ? (
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
  ) : (
    <LoadingScreen />
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
